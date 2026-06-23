import { Node, mergeAttributes } from '@tiptap/core';

export interface AudioOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    audio: {
      /**
       * Add an audio player
       */
      setAudio: (options: { src: string }) => ReturnType;
    }
  }
}

export const Audio = Node.create<AudioOptions>({
  name: 'audio',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'audio-wrapper w-full my-4',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'audio',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['audio', mergeAttributes(HTMLAttributes, {
      controls: 'true',
      class: 'w-full'
    })]]
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },

  addCommands() {
    return {
      setAudio: (options: { src: string }) => ({ tr, dispatch }) => {
        const { selection } = tr
        const node = this.type.create(options)

        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node)
        }

        return true
      },
    }
  },
})
