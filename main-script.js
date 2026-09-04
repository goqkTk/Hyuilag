const RING_RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function setScore(score) {
  const clamped = Math.max(0, Math.min(100, score));
  const ring = document.getElementById('ring-progress');
  ring.style.strokeDasharray = `${CIRCUMFERENCE}`;
  ring.style.strokeDashoffset = `${CIRCUMFERENCE}`;
  requestAnimationFrame(() => {
    const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
    ring.style.strokeDashoffset = `${offset}`;
  });
  document.getElementById('score-num').textContent = clamped;
}

setScore(72);

document.getElementById('today-check-btn').addEventListener('click', () => {
  alert('오늘의 체크 페이지로 이동합니다. (데모)');
});
