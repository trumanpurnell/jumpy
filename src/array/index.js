const utils = require('./utils')
const { ops, tensor, linear } = require('../algebra')

class MultiDimArray {

    constructor(A, header, shape) {
        this.header = {}

        if (header)
            this.header = header

        if (A) {
            this.header.shape = utils.raw.getShape(A)
            this.header.stride = utils.ndim.getStride(this.header.shape)
            this.header.array = new Float64Array(utils.raw.flatten(A))
            this.header.size = ops.product(this.header.shape)
            this.header.offset = 0
        }

        if (shape) {
            this.header.shape = shape
            this.header.stride = utils.ndim.getStride(shape)
            this.header.size = ops.product(shape)
            this.header.offset = 0
            this.header.array = new Float64Array(this.header.size)
        }
    }

    static array(A) {
        return new MultiDimArray(A)
    }

    static emptyLike(A) {
        return new MultiDimArray(null, null, A.header.shape)
    }

    static empty(shape) {
        return new MultiDimArray(null, null, shape)
    }

    static random(shape) {
        return new MultiDimArray(null, null, shape).map(Math.random)
    }

    static ones(shape) {
        return new MultiDimArray(null, null, shape).fill(1)
    }

    static zeros(shape) {
        return new MultiDimArray(null, null, shape)
    }

    map(fn) {
        for (let i = 0; i < this.header.size; i++)
            this.header.array[i] = fn()

        return this
    }

    fill(value) {
        this.header.array.fill(value)
        return this
    }

    static arange(start, end, step = 1) {

        let arraySize

        if (arguments.length === 1) {
            arraySize = start
            start = 0
        } else if (arguments.length === 2)
            arraySize = end - start
        else
            arraySize = Math.ceil((end - start) / step)

        return new MultiDimArray(null, null, [arraySize]).map(function (_, i) {
            return start + i * step
        })
    }

    dot(B) {
        return linear.matrixProduct(this, B)
    }

    plus(B) {
        return tensor.add(this, B)
    }

    times(B) {
        return tensor.multiply(this, B)
    }

    minus(B) {
        return tensor.subtract(this, B)
    }

    copy() {
        return new MultiDimArray(null, {
            ...this.header,
            array: new Float64Array(this.header.array)
        })
    }

    
    reshape(...shape) {
        return new MultiDimArray(null, {
            ...this.header,
            shape: shape,
            stride: utils.ndim.getStride(shape),
        })
    }

    T() {
        return new MultiDimArray(null, {
            ...this.header,
            shape: this.header.shape.slice().reverse(),
            stride: this.header.stride.slice().reverse(),
        })
    }

    slice(...index) {
        const localIndex = utils.ndim.findLocalIndex(index, this.header)

        if (utils.ndim.isFullySpecified(index, this.header.shape))
            return this.header.array[localIndex]

        const [newShape, newStride] = utils.ndim.getSlice(index, this.header)

        return new MultiDimArray(null, {
            shape: newShape,
            offset: localIndex,
            stride: newStride,
            array: this.header.array,
        })
    }

    set(type, value, ...index) {

        const [val] = value
        const localIndex = utils.ndim.findLocalIndex(index, this.header)

        switch (type) {
            case "+=": return this.header.array[localIndex] += val
            case "-=": return this.header.array[localIndex] -= val
            case "*=": return this.header.array[localIndex] *= val
            case "/=": return this.header.array[localIndex] /= val
            default: return this.header.array[localIndex] = val
        }

    }

    toString() {
        return utils.ndim.wrapperString(
            'array($)',
            utils.ndim.helperToString(this.header)
        )
    }

    inspect() {
        return this.toString()
    }
}

module.exports = { ndim: MultiDimArray }