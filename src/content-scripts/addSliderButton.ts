export const addSliderButton = ({ sliderButton }: ExtensionSettings) => {
    const proc = () => {
        const createSliderButton = () => {
            const slider = document.querySelector<HTMLInputElement>('input[type="range"]');
            if (!slider || slider.dataset.buttonAdded) {
                return;
            }

            const sliderName = slider.previousElementSibling?.textContent;
            if (!sliderName?.includes('Pen Size') && !sliderName?.includes('Strength')) {
                return;
            }

            type ButtonConfig = {
                type: 'Pen Size' | 'Strength';
                step: number;
                min?: number;
                parentWidth?: string;
            };

            let buttonConfig: ButtonConfig;
            if (sliderName.includes('Pen Size')) {
                if (
                    [...document.querySelectorAll('span')].every(
                        (span) => span.textContent !== 'Draw Mask',
                    )
                ) {
                    // ペイント画面には表示しない
                    return;
                }

                buttonConfig = { type: 'Pen Size', step: 1, min: 1 };
            } else {
                buttonConfig = { type: 'Strength', step: 0.05, parentWidth: '40px' };
            }

            if (buttonConfig.min) {
                slider.min = buttonConfig.min.toString();
            }

            type SizeOperator = '-' | '+';
            const createButton = (sizeOperator: SizeOperator): HTMLButtonElement => {
                const sizeButton = document.createElement('button');
                sizeButton.textContent = sizeOperator;
                sizeButton.style.width = '20px';
                sizeButton.style.backgroundColor = 'transparent';
                sizeButton.style.cursor = 'pointer';

                const onClick = () => {
                    const currentSliderValue = Number(slider.value);
                    const resultValue =
                        sizeOperator === '+'
                            ? currentSliderValue + buttonConfig.step
                            : currentSliderValue - buttonConfig.step;
                    slider.value = resultValue.toString();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (slider as any)._valueTracker = '';
                    slider.dispatchEvent(new Event('input', { bubbles: true }));
                };
                sizeButton.addEventListener('click', onClick);

                return sizeButton;
            };
            const increaseSizeButton = createButton('+');
            const decreaseSizeButton = createButton('-');

            const container = (() => {
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.gap = '10px';
                container.style.justifyContent = 'center';
                container.style.height = '25px';
                container.appendChild(decreaseSizeButton);
                container.appendChild(increaseSizeButton);
                return container;
            })();

            if (buttonConfig.type === 'Pen Size') {
                slider.previousElementSibling?.firstChild?.appendChild(container);
            } else {
                slider.previousElementSibling?.appendChild(container);
                (container.previousElementSibling as HTMLElement).style.width = '40px';
            }

            slider.dataset.buttonAdded = 'true';
        };
        createSliderButton();
    };

    sliderButton &&
        new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};
