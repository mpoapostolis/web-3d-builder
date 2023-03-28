import { useStore } from '@/store'
import { Euler } from 'three'
import { Xyz } from '../xyz'

export function ObjectSettings() {
  const store = useStore()
  const selected = store.nodes.find((node) => node.uuid === store.selectedNode)
  const rot = selected?.rotation ?? new Euler(0, 0, 0)

  return !selected ? null : (
    <div className='grid gap-4 p-2'>
      <div className='grid grid-cols-[1fr_3fr] '>
        <label className='label-text'>Type</label>
        <label className='text-xs font-bold'>{selected.type}</label>
      </div>

      <div className='grid grid-cols-[1fr_3fr] '>
        <label className='label-text'>Name</label>
        <input value={selected?.name ?? selected?.type} className='input input-xs focus:outline-none' />
      </div>

      <Xyz label='Position' values={selected?.position?.toArray() ?? [0, 0, 0]} />
      <Xyz label='Rotation' values={[rot.x, rot.y, rot.z]} />
      <Xyz label='Scale' values={selected?.scale?.toArray() ?? [0, 0, 0]} />

      <div className='label  mt-3 text-xs font-bold'>Animations</div>
      {Object.keys(selected?.actions ?? {}).map((key) => (
        <div key={key} className='grid grid-cols-2 '>
          <label className='label-text'>{key}</label>
          <button
            onClick={() => {
              if (!selected?.uuid) return

              store.updateNode(selected.uuid, { animation: selected.animation === key ? undefined : key })
            }}
            className='btn-xs btn'>
            {selected.animation === key ? 'Stop' : 'Play'}
          </button>
        </div>
      ))}
    </div>
  )
}
