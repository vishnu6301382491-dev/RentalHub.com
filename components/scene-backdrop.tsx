type SceneBackdropProps = {
  dense?: boolean;
};

export default function SceneBackdrop({ dense = false }: SceneBackdropProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="scene-grid absolute inset-0" />
      <div className="scene-orb scene-orb-a" />
      <div className="scene-orb scene-orb-b" />
      <div className="scene-orb scene-orb-c" />
      <div className={`scene-particles ${dense ? 'scene-particles-dense' : ''}`} />
    </div>
  );
}
