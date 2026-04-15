export default function CreateRepoModal({ setRepo, setFiles, close }) {
  async function handleCreate() {
    const name = prompt("Repo name");
    const password = prompt("Password");

    const res = await fetch("https://kq8vdhwvec.execute-api.ap-south-1.amazonaws.com/default/repo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    setRepo(data);
    setFiles([]);
    close();
  }

  return <button onClick={handleCreate}>Confirm Create</button>;
}