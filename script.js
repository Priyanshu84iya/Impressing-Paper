let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse Move
    document.addEventListener('mousemove', (e) => {
      this.handleMove(e.clientX, e.clientY, paper);
    });

    // Touch Move
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMove(touch.clientX, touch.clientY, paper);
    });

    // Mouse Down
    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;
      if (e.button === 0) {
        this.startX = this.prevX = this.moveX = e.clientX;
        this.startY = this.prevY = this.moveY = e.clientY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });

    // Touch Start
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;

      const touch = e.touches[0];
      this.startX = this.prevX = this.moveX = touch.clientX;
      this.startY = this.prevY = this.moveY = touch.clientY;
    });

    // Mouse Up and Touch End
    const endInteraction = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };
    window.addEventListener('mouseup', endInteraction);
    paper.addEventListener('touchend', endInteraction);

    // Gesture Rotation (for touch)
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }

  handleMove(x, y, paper) {
    if (!this.rotating) {
      this.moveX = x;
      this.moveY = y;

      this.velX = this.moveX - this.prevX;
      this.velY = this.moveY - this.prevY;
    }

    const dirX = x - this.startX;
    const dirY = y - this.startY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = 180 * angle / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;

    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      this.prevX = this.moveX;
      this.prevY = this.moveY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});