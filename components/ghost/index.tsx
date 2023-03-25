import { Tile, useStore } from '@/store'
import { Box } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

export function Ghost() {
  const store = useStore()
  const ghostTile = store.ghostTile as Tile
  const floorBaseColorMap = useLoader(TextureLoader, `/textures/${ghostTile?.material}/baseColor.jpg`)
  const floorRoughnessMap = useLoader(TextureLoader, `/textures/${ghostTile?.material}/roughness.jpg`)
  const floorNormalMap = useLoader(TextureLoader, `/textures/${ghostTile?.material}/normal.jpg`)
  const floorAmbientOcclusionMap = useLoader(TextureLoader, `/textures/${ghostTile?.material}/ambientOcclusion.jpg`)
  return (
    <Box scale={ghostTile.scale} name='floor' type='floor' position={ghostTile.position}>
      <meshStandardMaterial
        opacity={0.5}
        transparent
        // color={0x00ff00}
        map={floorBaseColorMap}
        normalMap={floorNormalMap}
        roughnessMap={floorRoughnessMap}
        aoMap={floorAmbientOcclusionMap}
      />
    </Box>
  )
}