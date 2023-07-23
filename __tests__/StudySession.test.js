import { render, fireEvent, act } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import {ref, onValue, get, push, runTransaction, child, set} from 'firebase/database';
import ChatRoom from '../src/components/Home/Session/ChatRoom';

const navigation = {
    goBack: jest.fn()
};

let alertSpy;
beforeEach(() => {
    alertSpy = jest.spyOn(Alert, 'alert');
});
afterEach(() => {
    alertSpy.mockRestore();
    navigation.goBack.mockRestore()
    //navigation.navigate.mockRestore();
    //navigation.pop.mockRestore();
});

jest.mock('firebase/database');

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
});

describe('Study Session', () => {
    it('can send message in the chat room', async () => {
        const session = {
            chatId: 'test',
            sessionName: 'test',
            sessionDescription: 'test',
            host: 'test',
            id: 'test',
            endTime: {string: 'test', timestamp: new Date().getTime() + 1000},
            startTime: {string: "test", timestamp: new Date().getTime() + 500},
            selectedDate: 'test',
            participants: ['test1', 'test2']
        };
        ref.mockReturnValue();
        onValue.mockReturnValue(() => {});
        get.mockResolvedValue({exists: () => true});
        runTransaction.mockResolvedValue();
        const {getByPlaceholderText, getByText} = render(<ChatRoom navigation={navigation} session={session}/>);
        await act(async () => {
            await fireEvent.changeText(getByPlaceholderText('Type your message...'), 'test');
            await fireEvent.press(getByText('Send'));
        });

        expect(runTransaction).toHaveBeenCalled();
        runTransaction.mockRestore()
    });

    it('will end automatically when end time is reached', async () => {
        const session = {
            chatId: 'test',
            sessionName: 'test',
            sessionDescription: 'test',
            host: 'test',
            id: 'test',
            endTime: {string: 'test', timestamp: new Date().getTime() - 500},
            startTime: {string: "test", timestamp: new Date().getTime() + 1000},
            selectedDate: 'test',
            participants: ['test1', 'test2']
        };
        ref.mockReturnValue();
        onValue.mockReturnValue(() => {});
        get.mockResolvedValue({exists: () => true});
        runTransaction.mockResolvedValue();
        const {getByPlaceholderText, getByText} = render(<ChatRoom navigation={navigation} session={session}/>);

        expect(alertSpy).toHaveBeenCalledWith('The session is ended');
    })
})