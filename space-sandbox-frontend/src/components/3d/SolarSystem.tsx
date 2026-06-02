import { Grid } from '@react-three/drei';
import Planet from './Planet';
import Skydome from './Skydome';
export default function System() {
  return (
    <>
      <Skydome />

      {/* Базове освітлення */}
      <ambientLight intensity={0.5} />

      {/* 2. HemisphereLight (Напівсферичне світло). 
          Воно додає глибини тіням: зверху дає легкий холодний космічний відтінок, 
          а знизу залишається темнішим. Це робить тіньову сторону об'ємною, а не просто сірою. */}
      <hemisphereLight args={['#4466ff', '#111111', 0.5]} />

      {/* 3. Твоє головне Сонце залишаємо як є */}
      <pointLight position={[0, 0, 0]} intensity={2000} color="#FDB813" distance={200} decay={2} />

      <Grid
        position={[0, -0.2, 0]} // Опускаємо трохи нижче орбіт, щоб лінії не перетиналися (z-fighting)
        infiniteGrid // Робить сітку нескінченною при русі камери
        fadeDistance={150} // Відстань, на якій сітка плавно розчиняється в темряві
        cellSize={2} // Розмір маленьких клітинок
        sectionSize={10} // Розмір великих квадратів (як на радарі)
        cellColor="#1a2035" // Темно-синій, ледь помітний колір дрібної сітки
        sectionColor="#2a3a55" // Трохи світліший колір для основних осей
        cellThickness={0.4} // Товщина дрібних ліній
        sectionThickness={0.8} // Товщина головних ліній
      />

      {/* 3. Сама модель Сонця */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 64, 64]} />
        {/* 2. HDR-трюк: 
          - toneMapped={false} відключає ліміти яскравості
          - color={[2, 1.5, 0]} означає, що червоний і зелений канали викручені на максимум (генерує жовто-помаранчевий)
        */}
        <meshBasicMaterial color={[2, 1.2, 0]} toneMapped={false} />
      </mesh>

      {/* Тестові планети (пізніше вони будуть мапитися з масиву) */}
      <Planet distance={10} speed={0.5} size={0.8} color="cyan" />
      <Planet distance={16} speed={0.3} size={1.2} color="orange" />
      <Planet distance={24} speed={0.2} size={1} color="gray" />

      {/* <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1} />
      </EffectComposer> */}
    </>
  );
}
