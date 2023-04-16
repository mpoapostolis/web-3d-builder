import { saveAs } from 'file-saver'
import { openDB } from 'idb'
import JSZip from 'jszip'
import { Mesh } from 'three'
import { Node, Scene, Store, useStore } from '.'

const defaultNodes = (
  [
    {
      name: 'Box',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      type: 'Box',
      scene: 'main',
    },
    {
      name: 'DirectionalLight',
      position: [2.3443115362954874, 0, 0.4895091354721197],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      type: 'DirectionalLight',
      scene: 'main',
    },
  ] as any[]
).map(jsonToMesh)

const defaultScenes: Scene[] = [
  {
    uuid: 'main',
    name: 'Main',
    type: 'color',
    color: '#999',
  },
]

export const defaultGameConf: Partial<Store> = {
  nodes: defaultNodes,
  scenes: defaultScenes,
  currentScene: defaultScenes?.at(0)?.uuid,
}

export async function initDb() {
  return openDB('vxlverse', 1, {
    upgrade(db) {
      db.createObjectStore('store', {
        autoIncrement: true,
      })
    },
  })
}

export function meshToJson(mesh: Partial<Node>) {
  return {
    name: mesh.name,
    position: mesh.position?.toArray(),
    rotation: mesh.rotation?.toArray(),
    scale: mesh.scale?.toArray(),
    blob: mesh.blob,
    animation: mesh.animation,
    color: mesh.color,
    scene: mesh.scene,
    gameType: mesh.gameType,
    actionToAnimation: mesh.actionToAnimation,
    type: mesh.type,
  }
}

export function jsonToMesh(json: Node) {
  const v3 = (json?.position ?? [0, 0, 0]) as number[]
  const e3 = (json.rotation ?? [0, 0, 0]) as number[]
  const s3 = (json.scale ?? [0, 0, 0]) as number[]

  console.log(json.actionToAnimation)
  const pair = Object.entries(json.actionToAnimation ?? {})
  const idleAnimation = pair.find(([_, key]) => key === 'idle')?.[0]
  const mesh = new Mesh() as Node
  mesh.position?.set(v3[0], v3[1], v3[2])
  mesh.rotation?.set(e3[0], e3[1], e3[2])
  mesh.scale?.set(s3[0], s3[1], s3[2])
  mesh.type = json.type
  mesh.blob = json.blob
  mesh.scene = json.scene
  mesh.gameType = json.gameType
  mesh.name = json.name
  mesh.url = json.blob ? URL.createObjectURL(json.blob) : undefined
  mesh.animation = idleAnimation
  mesh.color = json.color
  mesh.actionToAnimation = json.actionToAnimation
  mesh.type = json.type
  return mesh
}

export function exportGame() {
  const state = useStore.getState() ?? []
  const nodes = state.nodes.map(meshToJson) ?? []
  const scenes = state.scenes.map((scene) => ({
    ...scene,
    equirect: scene.blob ? URL.createObjectURL(scene.blob) : undefined,
  }))
  const hero = nodes.find((node) => node.gameType === 'hero')
  const zip = new JSZip()
  zip.file('gameConf.json', JSON.stringify({ nodes, scenes }))

  nodes.forEach((node) => {
    if (node?.blob) zip.file(`assets/gltf/${node.name}`, node.blob)
  })
  scenes.forEach((scene) => {
    if (scene?.blob) zip.file(`assets/equirect/${scene.name}`, scene.blob)
  })
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'game.zip')
  })
}

initDb().then(async (s) => {
  const [store] = (await s.getAll('store')) as {
    nodes: Node[]
    scenes: Scene[]
  }[]
  const scenes =
    store?.scenes?.map((obj) => ({
      ...obj,
      equirect: obj.blob ? URL.createObjectURL(obj.blob) : undefined,
    })) ?? defaultGameConf?.scenes
  useStore?.setState({
    nodes: store?.nodes?.map(jsonToMesh) ?? defaultGameConf?.nodes,
    scenes,
    selectedNode: undefined,
    currentScene: scenes?.at(0)?.uuid,
  })
})

export type CharAction = 'walk' | 'run' | 'attack' | 'jump' | 'die' | 'idle' | 'hit'

export const charActions: {
  label: string
  value: CharAction
}[] = [
  { label: 'Walk', value: 'walk' },
  { label: 'Run', value: 'run' },
  { label: 'Attack', value: 'attack' },
  { label: 'Jump', value: 'jump' },
  { label: 'Die', value: 'die' },
  { label: 'Idle', value: 'idle' },
  { label: 'Hit', value: 'hit' },
]