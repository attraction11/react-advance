import React, { Component } from 'react';
function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
const initTime = props => {
  let lastTime = 0;
  let targetTime = 0;
  try {
    if (Object.prototype.toString.call(props.target) === '[object Date]') {
      targetTime = props.target.getTime();
    } else {
      targetTime = new Date(props.target).getTime();
    }
  } catch (e) {
    throw new Error('invalid target prop', e);
  }
  lastTime = targetTime - new Date().getTime() - props.systimeoffset;
  return {
    lastTime: lastTime < 0 ? 0 : lastTime,
  };
};
class CountDown extends Component {
  timer = 0;
  interval = 1000;
  constructor(props) {
    super(props);
    const { lastTime } = initTime(props);
    this.state = {
      lastTime,
    };
  }
  static getDerivedStateFromProps(nextProps, preState) {
    const { lastTime } = initTime(nextProps);
    if (preState.lastTime !== lastTime) {
      return {
        lastTime,
      };
    }
    return null;
  }
  componentDidMount() {
    this.tick();
  }
  componentDidUpdate(prevProps) {
    const { target } = this.props;
    if (target !== prevProps.target) {
      clearTimeout(this.timer);
      this.tick();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  defaultFormat = time => {
    const days =  60 * 60 * 1000*24;
    const hours = 60 * 60 * 1000;
    const minutes = 60 * 1000;
    const d = Math.floor(time / days);
    time = time%days;
    const h = Math.floor(time / hours);
    time = time%hours;
    const m = Math.floor(time / minutes);
    time = time%minutes;
    const s = Math.floor(time / 1000);
    return (
      <span>
        {d?fixedZero(d)+'天':''}{h?fixedZero(h)+'小时':''}{m?fixedZero(m)+'分':''}{fixedZero(s)}秒
      </span>
    );
  };

  tick = () => {
    const { onEnd } = this.props;
    let { lastTime } = this.state;

    this.timer = setTimeout(() => {
      if (lastTime < this.interval) {
        clearTimeout(this.timer);
        this.setState(
          {
            lastTime: 0,
          },
          () => {
            if (onEnd) {
              onEnd();
            }
          }
        );
      } else {
        lastTime -= this.interval;
        this.setState(
          {
            lastTime,
          },
          () => {
            this.tick();
          }
        );
      }
    }, this.interval);
  };

  render() {
    const { format = this.defaultFormat, onEnd, ...rest } = this.props;
    const { lastTime } = this.state;
    const result = format(lastTime);

    return <span {...rest}>{result}</span>;
  }
}
export default CountDown;