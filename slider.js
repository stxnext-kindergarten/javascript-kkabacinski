class Slider {
  constructor($el) {
    this.$el = document.querySelector($el);
    this.pos = 0;

    if (!this.$el) {
      return false;
    }

    this.$next = this.$el.querySelector('.slider__arrow--right');
    this.$prev = this.$el.querySelector('.slider__arrow--left');
    this.$items = this.$el.querySelectorAll('.slider__item');
    this.$arrows = [this.$next, this.$prev];

    if (!this.$items.length) {
      return false;
    }

    this.setSliderHeight();
    this.bindEventListeners();
  }

  bindEventListeners() {
    this.$next.addEventListener('click', this.handleArrowClick('next'));
    this.$prev.addEventListener('click', this.handleArrowClick('prev'));
    window.addEventListener('resize', this.onWindowResize);
  }

  handleArrowClick(direction) {
    return (event) => {
      event.preventDefault();

      const key = `$${direction}`;
      const isDisabled = this[key].classList.contains(
        'slider__arrow--disabled'
      );

      if (isDisabled) {
        return;
      }

      this.$arrows.forEach((item) => {
        item.classList.remove('slider__arrow--disabled');
      });

      this.pos = direction === 'next' ? this.pos + 1 : this.pos - 1;
      const shouldBeDisabled =
        direction === 'next'
          ? this.pos + 1 >= this.$items.length
          : this.pos - 1 < 0;

      if (shouldBeDisabled) {
        this[key].classList.add('slider__arrow--disabled');
      }

      this.$el
        .querySelector('.slider__item--active')
        .classList.remove('slider__item--active');

      this.$el.querySelector(
        '.slider__wrapper'
      ).style.transform = `translate(-${this.pos * this.$el.offsetWidth}px,0)`;

      this.$el
        .querySelector(`.slider__item:nth-child(${this.pos + 1})`)
        .classList.add('slider__item--active');
      this.setSliderHeight();
    };
  }

  onWindowResize = _.debounce(() => {
    this.resizeSlider();
  }, 100);

  setSliderHeight() {
    const $active = this.$el.querySelector('.slider__item--active');

    this.$el.querySelector('.slider__wrapper').style.height = `${
      $active.offsetHeight
    }px`;
  }

  resizeSlider() {
    const $current = this.$el.querySelector(
      `.slider__item:nth-child(${this.pos + 1})`
    );

    this.$el.querySelector('.slider__wrapper').style.transform = `translate(-${
      $current.offsetLeft
    }px,0)`;

    this.setSliderHeight();
  }
}

var slider = new Slider('.slider');
