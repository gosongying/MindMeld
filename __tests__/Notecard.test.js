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
        expect(JSON.parse(AsyncStorage.setItem.mock.calls[1][1])[0].back).toBe('test2');
    });
});