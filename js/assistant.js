const assistantToggle = document.getElementById("assistantToggle");
const assistantPanel = document.getElementById("assistantPanel");
const assistantClose = document.getElementById("assistantClose");
const assistantMessages = document.getElementById("assistantMessages");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");

const addAssistantMessage = (content, sender = "bot") => {
  const message = document.createElement("div");
  message.className = `assistant-message ${sender}`;
  message.textContent = content;
  assistantMessages.appendChild(message);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
};

const matchesAny = (text, words) => words.some((word) => text.includes(word));

const localSuggestion = (question) => {
  const q = question.toLowerCase();
  const budgetMatch = q.match(/(?:rs|inr)?\s*(\d{1,5})/i);
  const budget = budgetMatch ? Number(budgetMatch[1]) : Infinity;
  const wantsGaming = matchesAny(q, ["game", "gaming", "fps", "esports"]);
  const wantsAirbuds = matchesAny(q, ["airbud", "earbud", "pods", "tws"]);
  const wantsHeadset = matchesAny(q, ["headset", "office", "meeting", "call", "mic"]);
  const wantsStudio = matchesAny(q, ["studio", "wired", "creator", "editing", "monitor"]);
  const wantsWireless = matchesAny(q, ["wireless", "travel", "anc", "bluetooth", "noise"]);
  const wantsTest = matchesAny(q, ["test", "demo", "qr", "checkout", "payment"]);

  if (!wantsGaming && !wantsAirbuds && !wantsHeadset && !wantsStudio && !wantsWireless && !Number.isFinite(budget) && !wantsTest) {
    return "Tell me your budget, main use case, and whether you prefer airbuds, wired headphones, wireless headphones, gaming, or office headsets. Then I can suggest exact models.";
  }

  let candidates = Store.products.filter((product) => product.id !== "test-rs1");
  if (wantsTest) candidates = Store.products.filter((product) => product.id === "test-rs1");
  if (wantsAirbuds) candidates = candidates.filter((product) => product.category === "Airbuds");
  if (wantsHeadset) candidates = candidates.filter((product) => product.category === "Headset");
  if (wantsGaming) candidates = candidates.filter((product) => product.category === "Gaming");
  if (wantsStudio) candidates = candidates.filter((product) => product.category === "Wired");
  if (wantsWireless && !wantsAirbuds) candidates = candidates.filter((product) => product.category === "Wireless");
  if (Number.isFinite(budget)) candidates = candidates.filter((product) => Store.discountedPrice(product) <= budget);

  const picks = candidates
    .sort((a, b) => b.rating - a.rating || Store.discountedPrice(a) - Store.discountedPrice(b))
    .slice(0, 3);

  if (!picks.length) {
    return "I could not find a match inside that budget. Share a higher budget or tell me if wired headphones are okay.";
  }

  return picks
    .map((product, index) => `${index + 1}. ${product.name} - ${Store.formatINR(Store.discountedPrice(product))}: ${product.shortDescription}`)
    .join("\n");
};

const sendAssistantQuestion = (question) => {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;

  addAssistantMessage(cleanQuestion, "user");
  addAssistantMessage(localSuggestion(cleanQuestion), "bot");
};

assistantToggle?.addEventListener("click", () => {
  assistantPanel.classList.toggle("hidden");
  assistantInput.focus();
});

assistantClose?.addEventListener("click", () => {
  assistantPanel.classList.add("hidden");
});

assistantForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  sendAssistantQuestion(assistantInput.value);
  assistantInput.value = "";
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => sendAssistantQuestion(button.dataset.prompt));
});
