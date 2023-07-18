import { render, fireEvent, act } from '@testing-library/react-native';
import React from 'react';
import Tasks from '../src/screen/Home/Tabs/StudyDashboard/Tasks';
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.useFakeTimers();

describe('Tasks', () => {
    it('can add new task', async () => {
        const date = new Date();
        const taskTime = `${date.getDate()}/${date.getMonth() + 1} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        const task = [{title: 'Test', checked: false, time: taskTime}]
       //AsyncStorage.getItem.mockResolvedValueOnce().mockResolvedValueOnce(task);
        //AsyncStorage.setItem.mockResolvedValueOnce().mockResolvedValueOnce(task);
        const {getByPlaceholderText, getByTestId} = render(<Tasks/>);
        expect(AsyncStorage.getItem).toHaveBeenCalled();
        expect(AsyncStorage.setItem).toHaveBeenCalled();
        const input = getByPlaceholderText('Enter a new task');

        await act(async () => {
            await fireEvent.changeText(input, 'Test');
            await fireEvent.press(getByTestId('add'));
            await fireEvent.press(getByTestId('confirm'));
        });

        expect(AsyncStorage.getItem).toHaveBeenCalledWith('tasks');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(task));

        AsyncStorage.getItem.mockRestore();
        AsyncStorage.setItem.mockRestore();
    });

    it('can toggle and remove task', async () => {
        const date = new Date();
        const taskTime = `${date.getDate()}/${date.getMonth() + 1} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        const task = [{title: 'Test', checked: false, time: taskTime}]
        const {getByPlaceholderText, getByTestId} = render(<Tasks/>);
        const input = getByPlaceholderText('Enter a new task');

        await act(async () => {
            await fireEvent.changeText(input, 'Test');
            await fireEvent.press(getByTestId('add'));
            await fireEvent.press(getByTestId('confirm'));
            //to check the task
            await fireEvent.press(getByTestId('check0'));
            //to remove the task
            await fireEvent(getByTestId('0'), 'longPress')
        });
        
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('tasks');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(task));
        //one for initial render, one for add task, one for check task, and one for remove task
        expect(AsyncStorage.setItem.mock.calls).toHaveLength(4);

        AsyncStorage.getItem.mockRestore();
        AsyncStorage.setItem.mockRestore();
    });
    
    it('can remove all tasks', async () => {
        const {getByPlaceholderText, getByTestId, getByText} = render(<Tasks/>);
        const input = getByPlaceholderText('Enter a new task');

        await act(async () => {
            await fireEvent.changeText(input, 'Test1');
            await fireEvent.press(getByTestId('add'));
            await fireEvent.press(getByTestId('confirm'));
            await fireEvent.changeText(input, 'Test2');
            await fireEvent.press(getByTestId('add'));
            await fireEvent.press(getByTestId('confirm'));
            await fireEvent.press(getByTestId('reset'));
            await fireEvent.press(getByText('Confirm'));
        });

        //the last time the function setItem is called with an empty array after removing all
        expect(AsyncStorage.setItem.mock.calls[3][1]).toBe('[]');
    })
});

