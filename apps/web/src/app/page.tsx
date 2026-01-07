export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>DuoFinder</h1>
      <p>Monorepo (Next App Router + Nest + Prisma).</p>
      <ul>
        <li><a href="/login">Login</a></li>
        <li><a href="/discover">Discover</a></li>
        <li><a href="/likes">Likes em mim</a></li>
        <li><a href="/matches">Matches</a></li>
      </ul>
    </main>
  );
}
