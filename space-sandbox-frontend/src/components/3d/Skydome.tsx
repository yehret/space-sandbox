import { Stars } from '@react-three/drei';

export default function Skydome() {
  return (
    <>
      {/* Замість кулі ми просто заливаємо "пустоту" сцени кольором космосу */}
      <color attach="background" args={['#030308']} />

      <Stars
        radius={100} // Зірки починаються далі від центру
        depth={300} // І простягаються дуже далеко вглиб
        count={10000} // Збільшуємо щільність
        factor={4} // Робимо їх трохи більшими
        saturation={0}
        speed={0.5} // Повільніше мерехтіння виглядає більш природно
      />
    </>
  );
}
