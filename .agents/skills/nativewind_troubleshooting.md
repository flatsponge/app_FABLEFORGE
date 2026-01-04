# NativeWind Interop Troubleshooting

## Problem
Dynamic addition/removal of certain classes in NativeWind 4.x causes a "Couldn't find a navigation context" error during re-renders.

## Problematic Classes
- `shadow-*`
- `transition-*`
- `opacity-*`
- `bg-color/opacity`

## Fixed Pattern
Use inline styles for conditional shadows/animations.

### Example
```tsx
const style = isActive ? { shadowColor: '#000', shadowOpacity: 0.1, ... } : undefined;
return <View className="bg-white" style={style} />;
```
