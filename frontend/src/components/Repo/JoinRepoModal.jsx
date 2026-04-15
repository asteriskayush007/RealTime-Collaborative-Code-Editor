export default function JoinRepoModal({ setRepo, setFiles, close }) {
  async function handleJoin() {
    const name = prompt("Repo name");
    const password = prompt("Password");

    const res = await fetch("YOUR_API/repo/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    setRepo(data);
    setFiles(data.files || []);
    close();
  }

  return <button onClick={handleJoin}>Confirm Join</button>;
}