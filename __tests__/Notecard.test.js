import { render, fireEvent, act } from '@testing-library/react-native';
import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Notecards from '../src/screen/Home/Tabs/StudyDashboard/Notecards';

afterEach(() => {
    AsyncStorage.getItem.mockRestore();
    AsyncStorage.setItem.mockRestore();
})

describe('Notecards', () => {
    it('notecards saved before will be fetched from async storage when rendering', async () => {
        render(<Notecards/>);

        expect(AsyncStorage.getItem).toHaveBeenCalledWith('notecards');
    });

    it('can add new notecards and will be saved into async storage', async () => {
        const {getByTestId, getByPlaceholderText, getByText} = render(<Notecards/>);
        
        await fireEvent.press(getByTestId('add'));
        await fireEvent.changeText(getByPlaceholderText('Front Text'), 'test1');
        await fireEvent.changeText(getByPlaceholderText('Back Text'), 'test2');
        await fireEvent.press(getByText('Confirm'));

        //the new added notecard is added into async storage
        expect(JSON.parse(AsyncStorage.setItem.mock.calls[1][1])[0].front).toBe('test1');
    });

    it('can reset all notecards', async () => {
        const {getByTestId, getByPlaceholderText, getByText} = render(<Notecards/>);
        
        await act(async () => {
        //add first notecard
        await fireEvent.press(getByTestId('add'));
        await fireEvent.changeText(getByPlaceholderText('Front Text'), 'test1');
        await fireEvent.changeText(getByPlaceholderText('Back Text'), 'test2');
        await fireEvent.press(getByText('Confirm'));

        //add second notecard
        await fireEvent.press(getByTestId('add'));
        await fireEvent.changeText(getByPlaceholderText('Front Text'), 'test1');
        await fireEvent.changeText(getByPlaceholderText('Back Text'), 'test2');
        await fireEvent.press(getByText('Confirm'));

        await fireEvent.press(getByTestId('setting'));
        //to toggle the switch
        await fireEvent(getByTestId('reset'), 'valueChange', true);
        await fireEvent.press(getByText('Confirm'));
        })

        //the setItem is called after deleting all notecards
        expect(AsyncStorage.setItem.mock.calls[3][1]).toBe('[]');

    })
});