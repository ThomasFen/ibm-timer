import { render, fireEvent, screen, act } from '@testing-library/react';
import Timer from './Timer';

describe('Timer', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('calls callback with leftover seconds when clicked', () => {
    const onCloseMock = jest.fn();
    const initialSeconds = 40;
    render(<Timer initialSeconds={initialSeconds} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText(initialSeconds));
    expect(onCloseMock).toHaveBeenCalledWith(initialSeconds);
  });

  it('counts down', () => {
    const initialSeconds = 40;
    jest.useFakeTimers();
    render(<Timer initialSeconds={initialSeconds} onClose={() => {}} />);
    expect(screen.getByText(initialSeconds)).toBeInTheDocument();
    act(()=> jest.advanceTimersByTime(1000));
    expect(screen.getByText(initialSeconds - 1)).toBeInTheDocument();
    act(()=> jest.advanceTimersByTime(1000)); 
    expect(screen.getByText(initialSeconds - 2)).toBeInTheDocument();
    act(()=> jest.advanceTimersByTime(1)); 
    expect(screen.getByText(initialSeconds - 3)).toBeInTheDocument();
    act(()=> jest.advanceTimersByTime(999)); 
    expect(screen.getByText(initialSeconds - 3)).toBeInTheDocument();
  });

  it('is done when timer runned out', () => {
    const initialSeconds = 1;
    jest.useFakeTimers();
    render(<Timer initialSeconds={initialSeconds} onClose={() => {}} />);
    expect(screen.getByText(initialSeconds)).toBeInTheDocument();
    expect(jest.getTimerCount()).toBe(1);
    act(()=> jest.advanceTimersByTime(1000));
    expect(screen.getByText(0)).toBeInTheDocument();
    act(()=> jest.advanceTimersByTime(1));
    expect(screen.getByText('Done!')).toBeInTheDocument();
    expect(jest.getTimerCount()).toBe(0);
  });

  it('timer pauses when mouse enters and resumes when mouse leaves', () => {
    const initialSeconds = 40;

    jest.useFakeTimers();
    render(<Timer initialSeconds={initialSeconds} onClose={() => {}} />);
    expect(screen.getByText(initialSeconds)).toBeInTheDocument();

    act(()=> jest.advanceTimersByTime(4284));

    fireEvent.mouseEnter(screen.getByText(initialSeconds - 5));
    expect(jest.getTimerCount()).toBe(0);

    act(()=> jest.advanceTimersByTime(5000));
    expect(screen.getByText('Paused...')).toBeInTheDocument();
    expect(screen.getByText(initialSeconds - 5)).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByText(initialSeconds - 5));

    act(()=> jest.advanceTimersByTime(5000));
    expect(screen.getByText(initialSeconds - 10)).toBeInTheDocument();

    act(()=> jest.advanceTimersByTime(716));
    expect(screen.getByText(initialSeconds - 10)).toBeInTheDocument();

    act(()=> jest.advanceTimersByTime(1));
    expect(screen.getByText(initialSeconds - 11)).toBeInTheDocument();
  });
});
