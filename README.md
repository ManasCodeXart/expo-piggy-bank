# expo-piggy-bank

A gravity-driven savings drop — animated coins fall from your quick-amount pad into a reactive piggy bank, synced to your save call and capped by a spring-loaded success sheet. Built for fintech apps.


<img width="1280" height="720" alt="Piggy-Bank" src="https://github.com/user-attachments/assets/b3265e25-a6c0-4e58-8772-3bac1656a380" />

---

## ✨ Features

- 🪙 **Physics-y coin fall** — each coin spawns with a staggered delay, tumbles (`rotateY` flip loop), drifts sideways before spring-settling into the slot, then absorbs into the piggy bank with a synced scale + fade
- 🎯 **Self-measuring slot** — the piggy bank measures its own coin-slot position on layout via a UI-thread `measure()` call, so coins land correctly at any screen size without hardcoded coordinates
- 🐖 **Imperative piggy reactions** — a `jiggle()` on every coin landing, a `proudPuff()` (spring overshoot + success haptic) once the full deposit settles
- 🔒 **Race-safe save/animation sync** — success only shows once *both* the coin-fall animation and your `onSave` promise have resolved, whichever finishes last. A 3s grace timer catches a slow `onSave` after the animation ends, without ever double-firing `onDone` or `onError`
- 🔢 **Custom keypad + quick-amount pills**, both driving a shared-value-backed `AnimatedCounter` that only re-renders on visible digit changes
- 🧠 **TypeScript-first** — discriminated `CoinDropState` union (`'idle' | 'dropping' | 'success' | 'error'`), fully typed props


---

## ⚙️ Installation

This isn't published as an npm package yet — copy the source directly into your project.

```bash
git clone https://github.com/ManasCodeXart/expo-piggy-bank
```

Copy `src/components/`, `src/constants/`, and `src/utils/`, plus `assets/images/` (`Coin.png`, `PiggyBank.png`) from the project root, into your project, then install the peer dependencies:

```bash
npx expo install react-native-reanimated react-native-worklets expo-haptics react-native-safe-area-context
```

> Reanimated 4.x ships its worklets runtime as the separate `react-native-worklets` package — it's required alongside `react-native-reanimated`, not optional.

> Requires `react-native-reanimated`'s Babel plugin already configured. No `react-native-gesture-handler` needed for this component.

---

## 🚀 Usage

```tsx
import { useCallback, useState } from 'react';
import GravitySavings from './components/GravitySavings';

const DEMO_AVATAR = require('./assets/images/Avatar.png');

export function SavingsScreen() {
  const [currentSavings, setCurrentSavings] = useState(3600);

  const handleSave = useCallback(async (amount: number) => {
    await depositToWallet(amount); // your real API call
    setCurrentSavings((prev) => prev + amount);
  }, []);

  return (
    <GravitySavings
      currentSavings={currentSavings}
      userName="ManasCodeXart"
      userAvatar={DEMO_AVATAR}
      onSave={handleSave}
      onError={(err) => console.warn('Save failed:', err)}
    />
  );
}
```

---

## ⚠️ Important: The Save Contract

`onSave` can be sync or return a promise. Either way, the success sheet only appears once **both** of these are true:

1. every spawned coin has finished falling and been absorbed into the piggy bank, **and**
2. `onSave` has resolved.

If `onSave` is still pending 3 seconds after the last coin lands, the component gives up, calls `onError`, and resets to the form — it will never silently hang. `currentSavings` is a controlled prop: `GravitySavings` doesn't update your balance internally, so add the saved amount to your own state inside `onSave` (see the example above).

---

## Preview




https://github.com/user-attachments/assets/db46eaea-d9a8-441d-a46a-bfe87cfc0928


---

## 🧱 Component Anatomy

```
<GravitySavings>
  ├─ PiggyBank         (measures the coin slot, imperative jiggle + proud-puff)
  ├─ Coin[]            (one per save, physics-driven fall + absorb)
  ├─ AnimatedCounter   (balance display + live keypad amount)
  ├─ Keypad            (custom numeric input, haptic per key)
  └─ SuccessSheet      (spring-in confirmation sheet)
```

`AnimatedCounter` and `Keypad` are also exported individually — both are fully self-contained and useful outside this component. `PiggyBank`, `Coin`, and `SuccessSheet` aren't, since they depend on shared layout measurements and drop-state owned by `GravitySavings` itself.

---

## 🧩 API

### `<GravitySavings>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `currentSavings` | `number` | — | Balance shown at the top. Controlled — update it yourself inside `onSave`. |
| `userName` | `string` | — | Shown on the success sheet. |
| `userAvatar` | `ImageSourcePropType` | — | Optional. Shown next to the balance and on the success sheet. |
| `currencySymbol` | `string` | `'$'` | Prefix used everywhere an amount is shown. |
| `quickAmounts` | `readonly QuickAmountPill[]` | `$100 / $500 / $1000` | Pills above the keypad. |
| `hapticsEnabled` | `boolean` | `true` | Enables keypad, jiggle, and success haptics. |
| `onSave` | `(amount: number) => void \| Promise<void>` | — | **Required.** Called on Save tap. See [The Save Contract](#️-important-the-save-contract). |
| `onDone` | `() => void` | — | Called when the user dismisses the success sheet's Done button. |
| `onReturnHome` | `() => void` | — | Optional. Adds a secondary "Return to Home" link to the success sheet. |
| `onError` | `(error: unknown) => void` | — | Called if `onSave` rejects, or times out per the save contract above. |

### Types

```ts
interface QuickAmountPill {
  readonly label: string;
  readonly value: number;
}

type CoinDropState = 'idle' | 'dropping' | 'success' | 'error';
```

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

---

## 🧱 Stack

[Expo SDK 57](https://expo.dev/changelog) · [React Native 0.86](https://reactnative.dev/) · [Reanimated 4.5](https://docs.swmansion.com/react-native-reanimated/) · [React Native Worklets 0.10](https://docs.swmansion.com/react-native-reanimated/) · Expo Haptics · react-native-safe-area-context
