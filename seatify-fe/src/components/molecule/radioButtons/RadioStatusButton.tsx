import { Typography } from '@mui/material';
import Radio from '~/components/atom/radio';
import { RadioProps, options } from '~/types/radio';
import { Wrapper } from './radioButton.styled';

const RadioStatusButton = ({ status }: RadioProps) => {
    const fallback = {
        label: '정보없음',
        color: 'grey',
    };

    const option = options[status] ?? fallback;

    return (
        <Wrapper>
            <Radio status={status} />
            <Typography variant="caption" color={option.color}>
                {option.label}
            </Typography>
        </Wrapper>
    );
};

export default RadioStatusButton;
