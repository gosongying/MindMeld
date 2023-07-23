import { render, fireEvent, act } from '@testing-library/react-native';
import React from 'react';
import Timer from '../src/screen/Home/Tabs/StudyDashboard/Timer';
import Stopwatch from '../src/screen/Home/Tabs/StudyDashboard/Stopwatch';

jest.useFakeTimers();

let setIntervalSpy;
let setTimeoutSpy;
beforeEach(() => {
    setIntervalSpy = jest.spyOn(window, 'setInterval');
    setTimeoutSpy = jest.spyOn(window, 'setTimeout');
});
afterEach(() => {
    setIntervalSpy.mockRestore();
    setTimeoutSpy.mockRestore();
})


describe('Timer', () => {
    it('can start the timer', async () => {
        const {getByText} = render(<Timer/>);
        const startButton = getByText('Start');

        await fireEvent.press(startButton);

        expect(setIntervalSpy).toHaveBeenCalled();
    });  

    it('can set time', async () => {
        const {getByText, getByTestId, getByPlaceholderText} = render(<Timer/>);

        await fireEvent.press(getByTestId('setTime'));
        await fireEvent.changeText(getByPlaceholderText('Time in seconds'), 60);
        await fireEvent.press(getByText('Confirm'));

        //setTimeout will be called when confirm to set time
        expect(setTimeoutSpy).toHaveBeenCalled();
    });
});

describe('Stop watch', () => {
    it('can start time', async () => {
        const {getByText} = render(<Stopwatch/>);

        await fireEvent.press(getByText('Start'));

        expect(setIntervalSpy).toHaveBeenCalled();
    });
});