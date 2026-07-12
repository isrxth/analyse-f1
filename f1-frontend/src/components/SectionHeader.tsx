interface Props {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="section-header">
      <span className="section-header__eyebrow">{eyebrow}</span>
      <h2 className="section-header__title">{title}</h2>
      <p className="section-header__description">{description}</p>
    </header>
  );
}
