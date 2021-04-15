<br />

<div align="center">
  <a href="../../"><img src="assets/logo.svg" width="420" /></a>
</div>

<br />

<div align="center">
  <a href="https://github.com/Marcisbee/exome/actions">
    <img alt="CI" src="https://img.shields.io/github/workflow/status/Marcisbee/exome/CI?style=flat-square" />
  </a>
  <a href="https://snyk.io/test/github/Marcisbee/exome">
    <img alt="snyk" src="https://img.shields.io/snyk/vulnerabilities/github/Marcisbee/exome?style=flat-square" />
  </a>
  <a href="https://www.npmjs.com/package/exome">
    <img alt="npm" src="https://img.shields.io/npm/v/exome.svg?style=flat-square" />
  </a>
  <a href="https://bundlephobia.com/result?p=exome">
    <img alt="package size" src="https://img.shields.io/bundlephobia/minzip/exome?style=flat-square" />
  </a>
</div>

<br />

<div align="center">
  Proxy based state manager for deeply nested states
</div>

## Features

- 📦 **Small**: Just **1 KB** minizipped
- 🚀 **Fast**: Uses **no diffing** of state changes see [**benchmarks**](benchmark/README.md)
- 😍 **Simple**: Uses classes as state
- 🧬 **Nested**: Easily manage deeply nested state structures
- 💪 **Immutable**: Data can only be changed via actions (only forced via typescript types)
- 🎛 **Middleware**: Built-in middleware for actions
- 🛡 **Bulletproof**: Written in strict TypeScript
- 🗂 **Typed**: All your state will be typed
- 🔭 **Devtools**: Redux devtools integration
- 💨 **Zero dependencies**

# Installation
To install the stable version:
```bash
npm install --save exome
```
This assumes you are using [npm](https://www.npmjs.com/package/exome) as your package manager.

# Usage
Library can be used without typescript, but I mostly recommend using it with typescript as it will guide you through what can and cannot be done as there are no checks without it and can lead to quite nasty bugs.

To create a typed store just create new class with name of your choosing by extending `Exome` class exported from `exome` library.

```ts
import { Exome } from 'exome'

// We'll have a store called "CounterStore"
class CounterStore extends Exome {
  // Lets set up one property "count" with default value "0"
  public count = 0

  // Now lets create action that will update "count" value
  public increment() {
    this.count++
  }
}
```

That is the basic structure of simple store. It can have as many properties as you'd like. There are no restrictions.

Now we should create an instance of `CounterStore` to use it.

```ts
const counterStore = new CounterStore()
```

Nice! Now we can start using `counterStore` state. Lets include it in our `react` component via `useStore` hook that is exported by `exome/react`.

```tsx
import { useStore } from 'exome/react'

function Counter() {
  const { count, increment } = useStore(counterStore)

  return (
    <button onClick={increment}>{count}</button>
  )
}
```

And that is it! No providers, no context, no boilerplate, just your state and actions.

# Redux devtools

You can use redux devtools extension to explore Exome store chunk by chunk.

Just add `exomeDevtools` middleware via `addMiddleware` function exported by library before you start defining store.

```ts
import { addMiddleware } from 'exome'
import { exomeDevtools } from 'exome/devtools'

addMiddleware(
  exomeDevtools({
    name: 'Exome Playground'
  })
)
```

Actions will look something like this:

```ts
[Counter] NEW
[Counter] increment
[Counter] increment
```

And store will be split into chunks for easy exploring:

```ts
Person
  0 { name: "John Wick", dogs: [...] }
  1 { name: "Jane Doe", dogs: [] }
Dog
  0 { name: "Jeff", breed: "beagle pup" }
```

# API
### `Exome`
A class with underlying logic that handles state changes. Every store must be extended from this class.

```ts
class Exome {}
```

__Example__

```ts
import { Exome } from "exome"

class Counter extends Exome {
  public count = 0

  public increment() {
    this.count += 1
  }
}
```

### `useStore`
Is function exported from "exome/react".

```ts
function useStore<T extends Exome>(store: T): Readonly<T>
```

__Arguments__
1. `store` _([Exome](#exome))_: State to watch changes from. Without Exome being passed in this function, react component will not be updated when particular Exome updates.

__Returns__

- [_Exome_](#exome): Same store is returned.

__Example__

```tsx
import { useStore } from "exome/react"

const counter = new Counter()

funtion App() {
  const { count, increment } = useStore(counter)
  
  return <button onClick={increment}>{count}</button>
}
```

### `saveState`
Function that saves snapshot of current state for any Exome and returns string.

```ts
function saveState(store: Exome): string
```

__Arguments__
1. `store` _([Exome](#exome))_: State to save state from (will save full state tree with nested Exomes).

__Returns__

- _String_: Stringiftied Exome instance

__Example__

```tsx
import { saveState } from "exome"

const saved = saveState(counter)
```

### `loadState`
Function that loads saved state in any Exome instance.

```ts
function loadState(
  store: Exome,
  state: string,
  config: Record<string, Exome>
): Record<string, any>
```

__Arguments__
1. `store` _([Exome](#exome))_: Store to load saved state to.
2. `state` _(String)_: Saved state string from `saveState` output.
3. `config` _(Object)_: Saved state string from `saveState` output.
   - key _(String)_: Name of the Exome state class (e.g. `"Counter"`).
   - value _([Exome](#exome) constructor)_: Class of named Exome (e.g. `Counter`).

__Returns__

- _Object_: Data that is loaded into state, but without Exome instance (if for any reason you have to have this data).

__Example__

```ts
import { loadState } from "exome"

const newCounter = new Counter()

const loaded = loadState(newCounter, saved, { Counter })
loaded.count // e.g. = 15
loaded.increment // undefined

newCounter.count // new counter instance has all of the state applied so also = 15
newCounter.increment // [Function]
```

# FAQ
### Q: Can I use Exome inside Exome?
YES! It was designed for that exact purpose.
Exome can have deeply nested Exomes inside itself. And whenever new Exome is used in child component, it has to be wrapped in `useStore` hook and that's the only rule.

For example:
```tsx
class Todo extends Exome {
  constructor(
    public message: string,
    public completed = false
  ) {}

  public complete() {
    this.completed = true
  }
}

class Store extends Exome {
  constructor(
    public list: Todo[]
  ) {}
}

const store = new Store([
  new Todo('Code a new state library', true),
  new Todo('Write documentation'),
])

function TodoView({ todo }: { todo: Todo }) {
  const { message, complete } = useStore(todo)

  return (
    <li>
      <strong>
        {message}
      </strong>

      <button onClick={complete}>
        complete
      </button>
    </li>
  )
}

function App() {
  const { list } = useStore(store)

  return (
    <ul>
      {list.map((todo) => (
        <TodoView todo={todo} />
      ))}
    </ul>
  )
}
```

### Q: Can deep state structure be saved to string and then loaded back as an instance?
YES! This was also one of key requirements for this. We can save full state from any Exome with [`saveState`](#saveState), save it to file or database and the load that string up onto Exome instance with [`loadState`](#loadState).

For example:
```tsx
const savedState = saveState(store)

const newStore = new Store()

loadState(newStore, savedState, { Todo })
```

# Motivation
I stumbled upon a need to store deeply nested store and manage chunks of them individually and regular flux selector/action architecture just didn't make much sense anymore. So I started to prototype what would ideal deeply nested store interaction look like and I saw that we could simply use classes for this.

**Goals I set for this project:**

- [x] Easy usage with deeply nested state chunks (array in array)
- [x] Single source of thruth (can be multiple tho, but it's up to you)
- [x] Type safe with TypeScript
- [x] To have actions be only way of editing state
- [x] To have effects trigger extra actions
- [x] Redux devtool support

# License
[MIT](LICENCE) &copy; [Marcis Bergmanis](https://twitter.com/marcisbee)
