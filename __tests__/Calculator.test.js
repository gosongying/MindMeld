import { render, fireEvent, act } from '@testing-library/react-native';
import React from 'react';
import Calculator from '../src/screen/Home/Tabs/StudyDashboard/Calculator';
import axios from 'axios';
import { Alert } from 'react-native';

jest.mock('axios');

describe('Calculator', () => {
    /*it('should update input when pressing number buttons', () => {
        const { getByText, getByPlaceholderText } = render(<Calculator />);
        const input = getByPlaceholderText('Enter your calculation');

        fireEvent.press(getByText('1'));
        expect(input.props.value).toBe('1');

        fireEvent.press(getByText('2'));
        expect(input.props.value).toBe('12');

        fireEvent.press(getByText('3'));
        expect(input.props.value).toBe('123');
    });*/

    it('should perform calculation correctly when pressing the equal button', async () => {
        const { getByText, getByPlaceholderText } = render(<Calculator />);
        const input = getByPlaceholderText('Enter your calculation');

        axios.get.mockResolvedValue({data: 3});

        await act(async () => {
            await fireEvent.press(getByText('1'));
            await fireEvent.press(getByText('+'));
            await fireEvent.press(getByText('2'));
            await fireEvent.press(getByText('='));
        });

        const apiKey = 'Y36GEU-TW4VU6G736';
        const apiUrl = `http://api.wolframalpha.com/v1/result?appid=${apiKey}&i=${encodeURIComponent(
            '1+2'
        )}`;

        //the calculation is fetched from the api 
        expect(axios.get).toHaveBeenCalledWith(apiUrl)
        return axios.get(apiUrl).then(response => expect(response.data).toBe(3))
    });

    it('show error for incorrect mathematical expression', async () => {
        const alertSpy = jest.spyOn(Alert, 'alert');
        const { getByText, getByPlaceholderText } = render(<Calculator />);
        const input = getByPlaceholderText('Enter your calculation');

        axios.get.mockRejectedValue('[AxiosError: Request failed with status code 501]')
        await act(async () => {
            await fireEvent.press(getByText('+'));
            await fireEvent.press(getByText('2'));
            await fireEvent.press(getByText('='));
        });

        const apiKey = 'Y36GEU-TW4VU6G736';
        const apiUrl = `http://api.wolframalpha.com/v1/result?appid=${apiKey}&i=${encodeURIComponent(
            '+2'
        )}`;

        //the calculation is fetched from the api 
        expect(axios.get).toHaveBeenCalledWith(apiUrl);
        expect(alertSpy).toHaveBeenCalledWith('Incorrect mathematical expression');
    });
});