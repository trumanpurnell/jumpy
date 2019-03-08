# big-box

That numpy shit in the browser, feel?

#### Installation

```sh
npm install big-box
```

## Basics

#### Array Creation

```js
import bb from 'big-box'

> const a = bb.array({ with: [2,3,4] })
> a
[ 2, 3, 4]
```

```js
> const b = bb.array({ with: [[1,2,3], [4,5,6]] })
> b
[[ 1, 2, 3],
[ 4, 5, 6]])

> a = bb.arange({ stop: 15 }).reshape(3, 5)
> a
[[  0,  1,  2,  3,  4],
[  5,  6,  7,  8,  9],
[ 10, 11, 12, 13, 14]])

> a.header.shape
[ 3, 5]

```

