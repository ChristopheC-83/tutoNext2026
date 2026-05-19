

export default function Title({ text, sub }: { text: string; sub: string }) {
  return (
    <div className="">
      <h1 className="text-2xl font-semibold">{text}</h1>
      <p className="text-sm">{sub}</p>
    </div>
  );
}
