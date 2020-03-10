// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Text from 'antd/lib/typography/Text';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Select, { SelectValue } from 'antd/lib/select';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';

interface InputElementParameters {
    inputType: string;
    values: string[];
    currentValue: string;
    onChange(value: string): void;
}

function renderInputElement(parameters: InputElementParameters): JSX.Element {
    const {
        inputType,
        values,
        currentValue,
        onChange,
    } = parameters;

    const renderCheckbox = (): JSX.Element => (
        <>
            <Text strong>Checkbox: </Text>
            <div className='attribute-annotation-sidebar-attr-elem-wrapper'>
                <Checkbox
                    onChange={(event: CheckboxChangeEvent): void => (
                        onChange(event.target.checked ? 'true' : 'false')
                    )}
                    checked={currentValue === 'true'}
                />
            </div>
        </>
    );

    const renderSelect = (): JSX.Element => (
        <>
            <Text strong>Values: </Text>
            <div className='attribute-annotation-sidebar-attr-elem-wrapper'>
                <Select
                    value={currentValue}
                    style={{ width: '80%' }}
                    onChange={(value: SelectValue) => (
                        onChange(value as string)
                    )}
                >
                    {values.map((value: string): JSX.Element => (
                        <Select.Option key={value} value={value}>{value}</Select.Option>
                    ))}
                </Select>
            </div>
        </>
    );

    const renderRadio = (): JSX.Element => (
        <>
            <Text strong>Values: </Text>
            <div className='attribute-annotation-sidebar-attr-elem-wrapper'>
                <Radio.Group
                    value={currentValue}
                    onChange={(event: RadioChangeEvent) => (
                        onChange(event.target.value)
                    )}
                >
                    {values.map((value: string): JSX.Element => (
                        <Radio style={{ display: 'block' }} key={value} value={value}>{value}</Radio>
                    ))}
                </Radio.Group>
            </div>
        </>
    );

    const renderNumber = (): JSX.Element => (
        <>
            <Text strong>Number: </Text>
            <div className='attribute-annotation-sidebar-attr-elem-wrapper'>
                <InputNumber
                    min={+values[0]}
                    max={+values[1]}
                    step={+values[2]}
                    value={+currentValue}
                    onChange={(value: number | undefined) => {
                        if (typeof (value) !== 'undefined') {
                            onChange(`${value}`);
                        }
                    }}
                />
            </div>
        </>
    );

    const renderText = (): JSX.Element => (
        <>
            <Text strong>Text: </Text>
            <div className='attribute-annotation-sidebar-attr-elem-wrapper'>
                <Input value={currentValue} />
            </div>
        </>
    );

    let element = null;
    if (inputType === 'checkbox') {
        element = renderCheckbox();
    } else if (inputType === 'select') {
        element = renderSelect();
    } else if (inputType === 'radio') {
        element = renderRadio();
    } else if (inputType === 'number') {
        element = renderNumber();
    } else {
        element = renderText();
    }

    return (
        <div className='attribute-annotation-sidebar-attr-editor'>
            {element}
        </div>
    );
}

interface ListParameters {
    inputType: string;
    values: string[];
}

function renderList(parameters: ListParameters): JSX.Element | null {
    const { inputType, values } = parameters;

    if (inputType === 'checkbox') {
        const sortedValues = ['True', 'False'];
        if (values[0].toLowerCase() !== 'true') {
            sortedValues.reverse();
        }

        return (
            <div className='attribute-annotation-sidebar-attr-list-wrapper'>
                <div>
                    <Text strong>0:</Text>
                    <Text>{` ${sortedValues[0]}`}</Text>
                </div>
                <div>
                    <Text strong>1:</Text>
                    <Text>{` ${sortedValues[1]}`}</Text>
                </div>
            </div>
        );
    }

    if (inputType === 'radio' || inputType === 'select') {
        return (
            <div className='attribute-annotation-sidebar-attr-list-wrapper'>
                {values.map((value: string, index: number): JSX.Element => (
                    <div key={value}>
                        <Text strong>{`${index}:`}</Text>
                        <Text>{` ${value}`}</Text>
                    </div>
                ))}
            </div>
        );
    }

    if (inputType === 'number') {
        return (
            <div className='attribute-annotation-sidebar-attr-list-wrapper'>
                <div>
                    <Text strong>From:</Text>
                    <Text>{` ${values[0]}`}</Text>
                </div>
                <div>
                    <Text strong>To:</Text>
                    <Text>{` ${values[1]}`}</Text>
                </div>
                <div>
                    <Text strong>Step:</Text>
                    <Text>{` ${values[2]}`}</Text>
                </div>
            </div>
        );
    }

    return null;
}

interface Props {
    attribute: any;
    currentValue: string;
    onChange(value: string): void;
}

function AttributeEditor(props: Props): JSX.Element {
    const { attribute, currentValue, onChange } = props;
    const { inputType, values } = attribute;

    return (
        <div>
            {renderList({ values, inputType })}
            <hr />
            {renderInputElement({
                inputType,
                currentValue,
                values,
                onChange,
            })}
        </div>
    );
}

export default React.memo(AttributeEditor);
