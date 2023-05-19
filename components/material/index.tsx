import { NodeMaterial } from '@/store'
import { useTexture } from '@react-three/drei'

export function Material(props: { material?: NodeMaterial; color?: string }) {
  let textureMap: NodeMaterial = {}

  if (props.material?.map) textureMap.map = props.material.map
  if (props.material?.displacement) textureMap.displacement = props.material.displacement
  if (props.material?.metalness) textureMap.metalness = props.material.metalness
  if (props.material?.normal) textureMap.normal = props.material.normal
  if (props.material?.roughness) textureMap.roughness = props.material.roughness

  const objMap = useTexture<{
    map?: string
    displacement?: string
    metalness?: string
    normal?: string
    roughness?: string
  }>(textureMap)
  return (
    <meshStandardMaterial
      key={textureMap.map}
      map={objMap.map}
      metalnessMap={objMap?.metalness ?? undefined}
      normalMap={objMap?.normal ?? undefined}
      roughnessMap={objMap?.roughness ?? undefined}
      color={props.color}
    />
  )
}