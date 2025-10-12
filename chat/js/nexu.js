const SUPABASE_URL = "https://ncpxzxvvzpfavbnsumlf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcHh6eHZ2enBmYXZibnN1bWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNTM1MDcsImV4cCI6MjA3NTcyOTUwN30.LX4dVgFmjvDhcFhcy_3KCpA1WLnGjRGUNQsrL60apb0"; // frontend can use anon key
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const chatDiv = document.getElementById('chat');
const messageForm = document.getElementById('messageForm');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');

// Load existing messages
async function loadMessages() {
  const { data, error } = await client
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading messages:', error.message);
    return;
  }

  chatDiv.innerHTML = '';
  data.forEach(addMessageToChat);
}

// Add a single message to chat
function addMessageToChat(msg) {
  const div = document.createElement('div');
  div.classList.add('msg', 'transition-all', 'duration-500', 'ease-out', 'opacity-100', 'scale-100');
  div.dataset.id = msg.id; // track ID for deletion
  div.innerHTML = `<span class="username">${msg.username}:</span> ${msg.content}`;
  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Remove a message from chat by ID with fade-and-shrink
function removeMessageFromChat(id) {
  const msgDiv = chatDiv.querySelector(`.msg[data-id="${id}"]`);
  if (msgDiv) {
    msgDiv.classList.remove("opacity-100", "scale-100");
    msgDiv.classList.add("opacity-0", "scale-75");
    setTimeout(() => msgDiv.remove(), 500);
  }
}

// Send a new message
messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const content = messageInput.value.trim();
  if (!username || !content) return;

  const { error } = await client.from('messages').insert([{ username, content }]);
  if (error) console.error('Error sending message:', error.message);

  messageInput.value = '';
});

// Real-time subscriptions
client
  .channel('messages')
  // INSERT subscription
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
    addMessageToChat(payload.new);
  })
  // DELETE subscription
  .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
    removeMessageFromChat(payload.old.id);
  })
  .subscribe();

// Load messages on page load
loadMessages();
