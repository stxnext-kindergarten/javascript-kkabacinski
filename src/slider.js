import debounce from 'lodash/debounce';

import styles from './slider.css';

const TEMPLATE = `<div class="${styles.controls}">
      <div class="${styles.arrow} ${styles['arrow--left']} ${
  styles['arrow--disabled']
}"></div>
      <div class="${styles.arrow} ${styles['arrow--right']}"></div>
  </div>
  <div class="${styles.wrapper}"></div>
`;

export default class Slider {
  constructor(config) {
    this.$el = config.$el;
    this.$slider = document.createElement('div');
    this.$slider.className = `${styles.slider}`;
    this.$slider.innerHTML = TEMPLATE;
    this.pos = 0;
    this.$wrapper = this.$slider.querySelector(`.${styles.wrapper}`);
    this.slides = config.slides;
    this.$next = this.$slider.querySelector(`.${styles['arrow--right']}`);
    this.$prev = this.$slider.querySelector(`.${styles['arrow--left']}`);
    this.$arrows = [this.$next, this.$prev];
    this.$items = this.slides.map((slide, index) => {
      var $slide = document.createElement('div');
      $slide.className =
        index === 0
          ? `${styles.item} ${styles['item--active']}`
          : `${styles.item}`;
      $slide.innerHTML = slide;

      this.$wrapper.appendChild($slide);

      return $slide;
    });

    this.render();
    this.bindEventListeners();
    this.setSliderHeight();
  }

  bindEventListeners() {
    this.$next.addEventListener('click', this.handleArrowClick('next'));
    this.$prev.addEventListener('click', this.handleArrowClick('prev'));
    window.addEventListener('resize', this.onWindowResize);
  }

  render() {
    this.$el.appendChild(this.$slider);
  }

  handleArrowClick(direction) {
    return (event) => {
      event.preventDefault();

      const key = `$${direction}`;
      const isDisabled = this[key].classList.contains(
        `${styles['arrow--disabled']}`
      );

      if (isDisabled) {
        return;
      }

      this.$arrows.forEach((item) => {
        item.classList.remove(`${styles['arrow--disabled']}`);
      });

      this.pos = direction === 'next' ? this.pos + 1 : this.pos - 1;
      const shouldBeDisabled =
        direction === 'next'
          ? this.pos + 1 >= this.$items.length
          : this.pos - 1 < 0;

      if (shouldBeDisabled) {
        this[key].classList.add(`${styles['arrow--disabled']}`);
      }

      this.$slider
        .querySelector(`.${styles['item--active']}`)
        .classList.remove(`${styles['item--active']}`);

      this.$wrapper.style.transform = `translate(-${this.pos *
        this.$slider.offsetWidth}px,0)`;

      this.$slider
        .querySelector(`.${styles.item}:nth-child(${this.pos + 1})`)
        .classList.add(`${styles['item--active']}`);
      this.setSliderHeight();
    };
  }

  onWindowResize = debounce(() => {
    this.resizeSlider();
  }, 100);

  setSliderHeight() {
    const $active = this.$slider.querySelector(`.${styles['item--active']}`);
    this.$wrapper.style.height = `${$active.offsetHeight}px`;
  }

  resizeSlider() {
    const $current = this.$slider.querySelector(
      `.${styles.item}:nth-child(${this.pos + 1})`
    );

    this.$wrapper.style.transform = `translate(-${$current.offsetLeft}px,0)`;

    this.setSliderHeight();
  }
}
