<script>
  export let data;
  const { profile, stats } = data;
</script>

<h2>Player Profile</h2>

<div class="card">
  <p><b>Username:</b> {profile.username ?? "Not set"}</p>
  <p><b>Email:</b> {profile.email}</p>
  <p><b>Joined:</b> {new Date(profile.createdAt).toLocaleDateString()}</p>
</div>

<h3>Stats</h3>

<div class="card">
  <p>Total Games: {stats.totalGames}</p>
  <p>Finished Games: {stats.finished}</p>
</div>

<div class="actions">
  <a href="/modes" class="btn">Create Game</a>
  <a href="/join" class="btn">Join Game</a>
</div>

<style>
  .card {
    padding: 12px;
    border: 1px solid #ccc;
    margin: 10px 0;
    border-radius: 6px;
  }

  .actions {
    margin-top: 15px;
    display: flex;
    gap: 10px;
  }

  .btn {
    padding: 8px 12px;
    border: 1px solid #333;
    text-decoration: none;
  }
</style>
