import { render, fireEvent, act } from '@testing-library/react-native';
import React from 'react';
import axios from 'axios';
import Dictionary from '../src/screen/Home/Tabs/StudyDashboard/Dictionary';

jest.mock('axios');

describe('Dictionary', () => {
    it('should return definitions of the word searched', async () => {
        const { getByText, getByPlaceholderText } = render(<Dictionary />);
        const input = getByPlaceholderText('Enter a word');

        axios.get.mockResolvedValue({
            data: [
                {shortdef: 'test1'},
                {shortdef: 'test2'}
            ]
        });

        await act(async () => {
            await fireEvent.changeText(input, 'School');
            await fireEvent.press(getByText('Search'));
        });

        const apiUrl = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/School?key=${process.env.EXPO_PUBLIC_DICT_API_KEY}`;

        //the definition is fetched from the api 
        expect(axios.get).toHaveBeenCalledWith(apiUrl)
        return axios.get(apiUrl).then(response => expect(response.data).toEqual([{shortdef: 'test1'}, {shortdef: 'test2'}]))
    });

    it('reset button works well', async () => {
        const { getByText, getByPlaceholderText, getByTestId } = render(<Dictionary />);
        const input = getByPlaceholderText('Enter a word');

        await act(async () => {
            await fireEvent.changeText(input, 'School');
            expect(input.props.value).toBe('School');
            await fireEvent.press(getByTestId('reset'));
        });

        expect(input.props.value).toBe('');
    });
});