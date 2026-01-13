import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCachedValue } from '@/hooks/useCachedValue';
import { CACHE_KEYS } from '@/lib/queryCache';

type PageData = {
    _id: string;
    pageIndex: number;
    text: string;
    imageUrl: string | null;
    imageStorageId?: string | null;
};

export interface UseReadingStateOptions {
    /** Book ID from route params */
    bookId: string | undefined;
    /** Initial page index to start from (e.g., from saved progress) */
    initialPage?: number;
    /** Whether this is a restart (ignore saved progress) */
    isRestart?: boolean;
}

export interface UseReadingStateResult {
    /** Current page index (0-based) */
    page: number;
    /** Set page index */
    setPage: React.Dispatch<React.SetStateAction<number>>;
    /** Get page data by index (from cache or live) */
    getPage: (index: number) => PageData | null;
    /** Current page data */
    currentPage: PageData | null;
    /** Current page text */
    currentText: string;
    /** Current display image URL */
    currentImage: string | null | undefined;
    /** Cache key for current display image */
    displayImageCacheKey: string | undefined;
    /** Reading progress percentage (0-100) */
    progress: number;
    /** Total number of pages */
    totalPages: number;
    /** Book title */
    bookTitle: string;
    /** Cover image URL */
    coverImage: string | null | undefined;
    /** Whether current page is loading */
    isPageLoading: boolean;
    /** The book data from Convex */
    book: ReturnType<typeof useQuery<typeof api.storyGeneration.getBook>> | null;
    /** Whether teaser book is currently generating */
    isTeaserGenerating: boolean;
}

/**
 * Hook for managing reading state: page navigation, caching, and progress.
 */
export function useReadingState({
    bookId,
    initialPage = 0,
    isRestart = false,
}: UseReadingStateOptions): UseReadingStateResult {
    const [page, setPage] = useState(initialPage);

    // Book query
    const liveBook = useQuery(
        api.storyGeneration.getBook,
        bookId ? { bookId: bookId as Id<'books'> } : 'skip'
    );
    const { data: convexBook } = useCachedValue(
        bookId ? CACHE_KEYS.book(bookId) : null,
        liveBook
    );

    // Current page query
    const liveCurrentPageData = useQuery(
        api.storyGeneration.getBookPage,
        bookId ? { bookId: bookId as Id<'books'>, pageIndex: page } : 'skip'
    );
    const { data: currentPageData } = useCachedValue(
        bookId ? CACHE_KEYS.bookPage(bookId, page) : null,
        liveCurrentPageData
    );

    // Prefetch next page
    const totalPages = convexBook?.pageCount ?? 0;
    const nextPageData = useQuery(
        api.storyGeneration.getBookPage,
        bookId && convexBook && page < totalPages - 1
            ? { bookId: bookId as Id<'books'>, pageIndex: page + 1 }
            : 'skip'
    );

    // Pages cache - keyed by bookId-pageIndex
    const pagesCache = useRef<Map<string, PageData>>(new Map());
    const lastBookId = useRef<string | null>(null);
    const lastTeaserStatus = useRef<string | undefined>(undefined);
    const hasInitializedPageRef = useRef(false);

    const getCacheKey = useCallback(
        (pageIndex: number) => `${bookId}-${pageIndex}`,
        [bookId]
    );

    // Clear cache when book changes
    useEffect(() => {
        if (bookId && bookId !== lastBookId.current) {
            pagesCache.current.clear();
            lastBookId.current = bookId;
        }
    }, [bookId]);

    // Clear cache when teaser book completes generation
    useEffect(() => {
        const currentStatus = convexBook?.teaserBookStatus;
        if (convexBook?.isTeaserBook && lastTeaserStatus.current !== currentStatus) {
            if (currentStatus === 'complete' && lastTeaserStatus.current !== 'complete') {
                pagesCache.current.clear();
            }
            lastTeaserStatus.current = currentStatus;
        }
    }, [convexBook?.isTeaserBook, convexBook?.teaserBookStatus]);

    // Cache current page
    useEffect(() => {
        if (currentPageData && bookId) {
            const cacheKey = getCacheKey(currentPageData.pageIndex);
            const existing = pagesCache.current.get(cacheKey);
            const hasNewImage = currentPageData.imageUrl && (!existing || !existing.imageUrl);
            if (!existing || hasNewImage) {
                pagesCache.current.set(cacheKey, currentPageData as PageData);
            }
        }
    }, [currentPageData, bookId, getCacheKey]);

    // Cache next page
    useEffect(() => {
        if (nextPageData && bookId) {
            const cacheKey = getCacheKey(nextPageData.pageIndex);
            const existing = pagesCache.current.get(cacheKey);
            const hasNewImage = nextPageData.imageUrl && (!existing || !existing.imageUrl);
            if (!existing || hasNewImage) {
                pagesCache.current.set(cacheKey, nextPageData as PageData);
            }
        }
    }, [nextPageData, bookId, getCacheKey]);

    // Initialize from saved progress
    useEffect(() => {
        if (
            convexBook?.lastReadPageIndex !== undefined &&
            convexBook.lastReadPageIndex > 0 &&
            !hasInitializedPageRef.current &&
            !isRestart
        ) {
            hasInitializedPageRef.current = true;
            setPage(convexBook.lastReadPageIndex);
        }
    }, [convexBook?.lastReadPageIndex, isRestart]);

    const getPage = useCallback(
        (idx: number): PageData | null => {
            const cached = pagesCache.current.get(getCacheKey(idx));
            const live = idx === page ? (currentPageData as PageData) : null;

            if (live && live.imageUrl && (!cached || !cached.imageUrl)) {
                return live;
            }

            return cached || live;
        },
        [page, currentPageData, getCacheKey]
    );

    const currentPage = getPage(page);
    const currentText = currentPage?.text ?? '';
    const coverImage = convexBook?.coverImageUrl;
    const currentImage = currentPage?.imageUrl ?? coverImage;

    const pageImageCacheKey =
        currentPage?.imageStorageId ??
        (bookId && currentPage?.imageUrl ? `${bookId}-page-${currentPage.pageIndex}` : undefined);
    const coverImageCacheKey =
        convexBook?.coverImageStorageId ?? (bookId && coverImage ? `${bookId}-cover` : undefined);
    const displayImageCacheKey = pageImageCacheKey ?? coverImageCacheKey;

    const progress = totalPages > 0 ? ((page + 1) / totalPages) * 100 : 0;

    const isTeaserGenerating =
        !!convexBook?.isTeaserBook &&
        (convexBook.teaserBookStatus === 'pending' || convexBook.teaserBookStatus === 'generating');

    return {
        page,
        setPage,
        getPage,
        currentPage,
        currentText,
        currentImage,
        displayImageCacheKey,
        progress,
        totalPages,
        bookTitle: convexBook?.title || 'Story',
        coverImage,
        isPageLoading: currentPageData === undefined,
        book: convexBook ?? null,
        isTeaserGenerating,
    };
}
