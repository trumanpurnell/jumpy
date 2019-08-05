
import { litComp } from './utils'

export default function (operation) {
    return function (args) {
        return new Function('args', [
            operation.begin(args),

            'for(let i = 0; i < this.indices.result.length; i++){',

            operation.middle({
                ofReal: `args.of.data[this.indices.of[i]]`,
                ofImag: `args.of.data[this.indices.of[i] + 1]`,

                withReal: `args.with.data[this.indices.with[i]]`,
                withImag: `args.with.data[this.indices.with[i] + 1]`,

                resultReal: `args.result.data[this.indices.result[i]]`,
                resultImag: `args.result.data[this.indices.result[i] + 1]`,
            }),

            '}',

            operation.end(args),

            'return args.result'

        ].join('\n')).bind({ indices: litComp(args) })
    }
}
