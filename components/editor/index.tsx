'use client'

import { Animations } from '../settings/animations'
import { GameProperties } from '../settings/gameProperties'
import { GlbModel } from '../settings/glbModel'
import { Material } from '../settings/material'
import { NodeList } from '../settings/nodeList'
import { Physics } from '../settings/physics'
import { Quests } from '../settings/quests'
import { TransformSettings } from '../settings/transform'

export default function Editor() {
  return (
    <div className=" border-base-300 lg:h-screen w-full   border-l bg-mauve4 p-2 pb-12 overflow-auto ">
      <NodeList />
      <TransformSettings />
      <GlbModel />
      <Material />
      <Animations />
      <GameProperties />
      <Physics />
      <Quests />
    </div>
  )
}
