import { render, fireEvent, act } from '@testing-library/react-native';
import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Notes from '../src/screen/Home/Tabs/StudyDashboard/Notes';

const navigation = {
    replace: jest.fn(),
    goBack: jest.fn()
};

describe('Notes', () => {
    it('notes saved before will be fetched from async storage when rendering', async () => {
        render(<Notes navigation={navigation}/>);
        expect(AsyncStorage.getItem).toHaveBeenCalled();

        AsyncStorage.getItem.mockRestore();
    });

    it('notes will be saved when typing', async () => {
        const {getByPlaceholderText} = render(<Notes navigation={navigation}/>);
        const input = getByPlaceholderText('Write your notes here');

        await act(async () => {
            await fireEvent.changeText(input, 'test');
        });

        expect(AsyncStorage.setItem).toHaveBeenCalledWith('noteText', 'test');

        AsyncStorage.setItem.mockRestore();
    });

    it('can clear all notes', async () => {
        const {getByPlaceholderText, getByText, getByTestId} = render(<Notes navigation={navigation}/>);
        const input = getByPlaceholderText('Write your notes here');

        await act(async () => {
            await fireEvent.changeText(input, 'test');
            await fireEvent.press(getByTestId('clear'));
            await fireEvent.press(getByText('Confirm'));
        });

        //after clearing, it will be called with empty string
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('noteText', '');
    })
});