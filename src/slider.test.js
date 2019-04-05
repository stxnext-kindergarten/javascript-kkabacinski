//jest.dontMock('lodash');
jest.disableAutomock();
import styles from './slider.css';
import Slider from './slider.js';

const options = {
  $el: document.querySelector('body'),
  slides: [
    '<img src="https://placeimg.com/1920/480/any" />',
    '<img src="https://placeimg.com/1920/380/any" />',
    '<img src="https://placeimg.com/1920/520/any" />',
    '<img src="https://placeimg.com/1920/580/any" />',
    '<img src="https://placeimg.com/1920/420/any" />',
  ],
};

describe('Constructor should create slider and call proper methods', () => {
  let slider;
  let spyRender;
  let spyBindEventListeners;
  let spySetSliderHeight;

  beforeEach(() => {
    spyRender = jest.spyOn(Slider.prototype, 'render');
    spyBindEventListeners = jest.spyOn(Slider.prototype, 'bindEventListeners');
    spySetSliderHeight = jest.spyOn(Slider.prototype, 'setSliderHeight');
    slider = new Slider(options);
  });

  afterEach(() => {
    spyRender.mockRestore();
    spyBindEventListeners.mockRestore();
    spySetSliderHeight.mockRestore();
    slider.destroy();
  });

  test('Slider should be rendered', () => {
    expect(spyRender).toHaveBeenCalledTimes(1);
  });

  test('Constructor should set events', () => {
    expect(spyBindEventListeners).toHaveBeenCalledTimes(1);
  });

  test('Constructor should set slider height', () => {
    expect(spySetSliderHeight).toHaveBeenCalledTimes(1);
  });

  test('Slider should have slides', () => {
    expect(slider.$items.length).toBeGreaterThan(0);
  });
});

describe('bindEventListeners should bind handlers for arrows and window resize', () => {
  let spyOnWindowResize;
  let spyOn$next;
  let spyOn$prev;
  let originBindEventListeners;

  beforeEach(() => {
    originBindEventListeners = Slider.prototype.bindEventListeners;

    let $next = document.createElement('div');
    let $prev = document.createElement('div');

    Slider.prototype.bindEventListeners = Slider.prototype.bindEventListeners.bind({
      '$next': $next,
      '$prev': $prev,
      'handleNextArrowClick': () => { },
      'handlePrevArrowClick': () => { },
      'onWindowResize': () => { }
    });

    spyOnWindowResize = jest.spyOn(window, 'addEventListener');
    spyOn$next = jest.spyOn($next, 'addEventListener');
    spyOn$prev = jest.spyOn($prev, 'addEventListener');

    Slider.prototype.bindEventListeners();
  });

  afterEach(() => {
    Slider.prototype.bindEventListeners = originBindEventListeners;
  });

  test('Next arrow handle click should be bound', () => {
    expect(spyOn$next).toHaveBeenCalledWith('click', expect.anything());
  });

  test('Prev arrow handle click should be bound', () => {
    expect(spyOn$prev).toHaveBeenCalledWith('click', expect.anything());
  });

  test('Window resize event should be bound', () => {
    expect(spyOnWindowResize).toHaveBeenCalledWith('resize', expect.anything());
  });
});
