import React, { useEffect, useState } from 'react';
import { OrgData, OrgDatas } from '../../reducers/organization/organizationTypes';

type DropDownProps = {
    orgs: OrgDatas;
    showDropDown: boolean,
    toggleDropDown: Function,
    orgSelection: Function,
};

const DropDown: React.FC<DropDownProps> = ({
    orgs,
    orgSelection,
}: DropDownProps): JSX.Element => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    /**
     * Handle passing the city name
     * back to the parent component
     *
     * @param city  The selected city
     */
    const onClickHandler = (org: OrgData): void => {
        orgSelection(org);
    };

    useEffect(() => {
        setShowDropDown(showDropDown);
    }, [showDropDown]);

    return (
        <>
            <div className={showDropDown ? 'dropdown' : 'dropdown active'}>
                {orgs.map(
                    (value: OrgData, index: number): JSX.Element => {
                        return (
                            <p
                                key={index}
                                onClick={(): void => {
                                    onClickHandler(value);
                                }}
                            >
                                {value.Name}
                            </p>
                        );
                    }
                )}
            </div>
        </>
    );
};

export default DropDown;