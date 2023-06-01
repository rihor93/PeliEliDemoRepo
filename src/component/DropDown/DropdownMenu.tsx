import React, { useState } from "react";
import DropDown from "./Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { OrgData } from "../../reducers/organization/organizationTypes";
import { setCurOrg } from "../../reducers/actions/currentOrgActions";
import { loadUserServerData } from "../../reducers/actions/userInfoActions";

const DropdownMenu: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const currentOrg = useSelector((state: RootState) => state.userOrg.curOrg);
    const userInfoLoading = useSelector((state: RootState) => state.userInfo.loading);
    const orgDatas = useSelector((state: RootState) => state.orgDatas.data);
    const orgLoading = useSelector((state: RootState) => state.orgDatas.loading);

    /**
     * Toggle the drop down menu
     */
    const toggleDropDown = () => {
        setShowDropDown(!showDropDown);
    };

    /**
     * Hide the drop down menu if click occurs
     * outside of the drop-down element.
     *
     * @param event  The mouse event
     */
    const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
        if (event.currentTarget === event.target) {
            setShowDropDown(false);
        }
    };

    /**
     * Callback function to consume the
     * city name from the child component
     *
     * @param city  The selected city
     */
    const orgSelection = (org: OrgData): void => {
        // @ts-ignore
        dispatch(loadUserServerData(org.Id as number));
    };

    const getCurrentOrg = (): string => {
        //console.log('getCurrentOrg', orgDatas);
        const resOrg = orgDatas.find(a => a.Id == currentOrg)?.Name;
        return resOrg !== undefined ? resOrg : "Организация не выбрана";
    }

    return (
        <>
            {orgLoading || userInfoLoading ? <div> идёт загрузка...</div> : (
                <button
                    className={showDropDown ? "active" : undefined}
                    onClick={(): void => toggleDropDown()}
                    onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
                        dismissHandler(e)
                    }
                >
                    <div>{getCurrentOrg()} </div>
                    {showDropDown && (
                        <DropDown
                            orgs={orgDatas}
                            showDropDown={false}
                            toggleDropDown={(): void => toggleDropDown()}
                            orgSelection={orgSelection}
                        />
                    )}
                </button>)}
        </>
    );
};

export default DropdownMenu;

