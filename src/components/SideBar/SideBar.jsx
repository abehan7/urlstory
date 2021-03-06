import React from "react";
import styled from "styled-components";
import { media } from "../../assets/Themes";
import {
  HiOutlineDocumentAdd,
  HiOutlineDocumentRemove,
  HiOutlineFolder,
  HiOutlineFolderAdd,
  HiOutlineFolderRemove,
} from "react-icons/hi";
import { FcFolder } from "react-icons/fc";
import toast from "react-hot-toast";

import { CgBackspace, CgEditBlackPoint, CgHashtag } from "react-icons/cg";
import Footer from "../Footer/Footer.jsx";
import {
  constants,
  sidebarEditModeList,
  sidebarNormalModeList,
  useMode,
} from "../../contexts/ModeContext.jsx";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import { useUrl } from "../../contexts/UrlContext.jsx";
import { useModal } from "../../contexts/ModalContext.jsx";
import { useTag } from "../../contexts/TagContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../redux/ReducersT/tokenReducer.js";
import { useFolder } from "../../contexts/FolderContext.jsx";
import {
  getFolders,
  SET_FOLDER_CONTENTS,
} from "../../store/reducers/Folders.js";
import { useEffect } from "react";
import { RiShareBoxFill } from "react-icons/ri";

// import {} from "react-icons"

export const SideBarEl = styled.div`
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateX(-50%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  z-index: 2;
  height: 100%;
  width: 200px;
  background-color: #fff;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  display: flex;
  flex-direction: column;

  ${media[1100]} {
    width: 100px;
  }

  ${media.mobile} {
    position: absolute;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    ${({ isSidebarOpen }) => isSidebarOpen && `transform: translateX(0);`}
    height:calc(100% - 70px);
  }
`;

const Button = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  color: #c4c4c4;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;

  ::before {
    background-color: #fff;
    left: 0;
    content: "";
    height: 100%;
    width: 2px;
    position: absolute;
    transition: all 0.2s ease-in-out;
  }

  :hover {
    background-color: #a597fe1a;
    color: black;
    ::before {
      background-color: #a597fe;
    }
    ${media[1100]} {
      background-color: #fff;
      ::before {
        background-color: #fff;
      }
    }
  }

  ${media[1100]} {
    justify-content: center;
  }
`;

const IconWrapper = styled.div``;
const TextWrapper = styled.div`
  ${media[1100]} {
    display: none;
  }
`;
const Text = styled.span``;
const Icon = styled.div`
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 0.5rem;
  ${media[1100]} {
    padding: 0;
    font-size: 1.5rem;
  }
`;

const TagWrapper = styled.div`
  padding-left: 2rem;
  position: relative;
  > div {
    ::before {
      transition: all 0.2s ease-in-out;
      background-color: #ddd;
      left: 0;
      content: "";
      height: 100%;
      width: 2px;
      position: absolute;
    }
  }
  ${media[1100]} {
    padding-left: 0;
  }
`;
const Img = styled.img`
  width: 40px;
  filter: drop-shadow(15px 5px 5px rgba(0, 0, 0, 0.5));
  padding-bottom: 0.5rem;
`;

export const FaviconWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const FaviconContainer = styled.div`
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
`;

export const ImgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;

  width: 80%;
  height: 100%;
  flex-direction: column;
`;
export const Ment = styled.span`
  font-size: 1.1rem;
  color: gray;
  padding-top: 0.3rem;
  text-align: center;
`;

export const TapsWrapper = styled.div`
  animation: fadeIn 0.5s ease-in-out;
`;
const DeleteWrapper = styled(TapsWrapper)`
  > div:nth-child(2) {
    :hover {
      background-color: #ffcccb7a;
      ::before {
        background-color: tomato;
      }
    }
  }
`;

const NormalWrapper = styled.div`
  animation: fadeIn 0.5s ease-in-out;
  pointer-events: ${({ token, isLoading }) =>
    token && !isLoading ? "auto" : "none"};
`;

const EditWrapper = styled(TapsWrapper)``;

const FolderWrapper = styled(TapsWrapper)`
  > div {
    :hover {
      background-color: #e6c7b675;
      ::before {
        background-color: #e6c7b6;
      }
    }
    ::before {
      transition: all 0.2s ease-in-out;
      left: 0;
      content: "";
      height: 100%;
      width: 2px;
      position: absolute;
    }
  }
`;

const FolderIcon = styled.div`
  font-size: 1.7rem;
`;

const SideBar = () => {
  const mode = useMode().mode;
  const isSidebarOpen = useMode().isSidebarOpen;

  // const currentFolder = useFolder().currentFolder;
  const folderTitle = useFolder().currentFolder?.folder_name;
  const folderIconList = [
    constants.FOLDER,
    constants.FOLDER_EDIT_URL,
    constants.FOLDER_ADD,
    constants.FOLDER_DELETE,
    constants.FOLDER_EDIT,
    constants.FOLDER_EDIT_MODAL_UP,
  ];

  const folderNameList = [
    constants.FOLDER,
    constants.FOLDER_ADD,
    constants.FOLDER_DELETE,
    constants.FOLDER_EDIT,
    constants.FOLDER_EDIT_MODAL_UP,
  ];
  // console.log(currentFolder);

  // ????????? ???

  const NormalModeTaps = () =>
    sidebarNormalModeList.includes(mode) && <NormalModeItems />;

  const DeleteModeTaps = () => constants.DELETE === mode && <DeleteModeItems />;

  const EditModeTaps = () =>
    sidebarEditModeList.includes(mode) && <EditModeItems />;

  // ?????? ???
  const FolderTaps = () => constants.FOLDER === mode && <FolderModeItems />;

  const FolderEditTaps = () =>
    constants.FOLDER_EDIT === mode && <FolderEditModeItems />;

  const FolderDeleteTaps = () =>
    constants.FOLDER_DELETE === mode && <FolderDeleteModeItems />;

  // ?????? ?????? ??? ????????? ???
  const FolderEditUrlTaps = () =>
    constants.FOLDER_EDIT_URL === mode && <FolderEditUrlModeItems />;

  const FolderIconImg = () =>
    folderIconList.includes(mode) && (
      <FolderIcon>
        <FcFolder />
      </FolderIcon>
    );

  const FaviconImg = () =>
    !folderIconList.includes(mode) && (
      <Img src="img/logotest2.png" alt="logoImage" />
    );
  return (
    <SideBarEl className="mobile--sidebar" isSidebarOpen={isSidebarOpen}>
      <FaviconWrapper>
        <FaviconContainer>
          <ImgWrapper>
            {FolderIconImg()}
            {FaviconImg()}
            <Ment>
              {folderNameList.includes(mode) && "Folder"}
              {constants.FOLDER_EDIT_URL === mode && folderTitle}
              {!folderIconList.includes(mode) && "Welcome!"}
            </Ment>
          </ImgWrapper>
        </FaviconContainer>
      </FaviconWrapper>
      {/* ??? ?????? */}
      {/* ????????? */}
      {NormalModeTaps()}
      {DeleteModeTaps()}
      {EditModeTaps()}
      {/* ?????? */}
      {FolderTaps()}
      {FolderEditTaps()}
      {FolderDeleteTaps()}
      {/* ?????? ?????? ??? ????????? */}
      {FolderEditUrlTaps()}
      <Footer />
    </SideBarEl>
  );
};

export default SideBar;

//  Q space => git branch -a ???????????? ??????

export const Item = ({ children, name, onClick }) => {
  return (
    <Button onClick={onClick}>
      <IconWrapper>
        <Icon>{children}</Icon>
      </IconWrapper>
      <TextWrapper>
        <Text>{name}</Text>
      </TextWrapper>
    </Button>
  );
};

const NormalModeItems = () => {
  const setMode = useMode().setMode;
  const setModalMode = useMode().setModalMode;
  const handleGetTotalTags = useTag().handleGetTotalTags;
  const totlaUrlLoading = useUrl().loading.isTotalUrl;
  const onClickAdd = () => setModalMode(constants.ADD);
  const onClickDelete = () => setMode(constants.DELETE);
  const onClickHashtag = () => {
    handleGetTotalTags();
    setModalMode(constants.HASHTAG);
  };
  const onClickEdit = () => setMode(constants.EDIT);
  const onClickFolder = () => setMode(constants.FOLDER);
  const sidebarAnimeCount = useMode().count.sidebarAnimeCount;
  const token = useSelector(getToken);

  return (
    <NormalWrapper
      token={token}
      count={sidebarAnimeCount}
      isLoading={totlaUrlLoading}
    >
      <Item name="????????????" onClick={onClickAdd}>
        <HiOutlineDocumentAdd />
      </Item>
      <Item name="????????????" onClick={onClickDelete}>
        <HiOutlineDocumentRemove />
      </Item>
      <Item name="????????????" onClick={onClickEdit}>
        <CgEditBlackPoint />
      </Item>
      <TagWrapper onClick={onClickFolder}>
        <Item name="????????????">
          <HiOutlineFolder />
        </Item>
      </TagWrapper>

      <TagWrapper onClick={onClickHashtag}>
        <Item name="??????????????????">
          <CgHashtag />
        </Item>
      </TagWrapper>
    </NormalWrapper>
  );
};

const DeleteModeItems = () => {
  const setMode = useMode().setMode;
  const filterdUrls = useUrl().url.filterdUrls;
  const handleAddDeleteUrlList = useUrl().handleAddDeleteUrlList;
  const handleResetDeleteUrl = useUrl().handleResetDeleteUrl;
  const totalUrls = useUrl().url.totalUrls;
  const handleAlertTrigger = useModal().handleAlertTrigger;
  const handleOnClickDeleteUrl = useUrl().handleOnClickDeleteUrl;
  const deleteUrls = useUrl().url.deleteUrls;

  const checkError = () => {
    if (deleteUrls.length === 0) {
      toast.error("????????? ???????????? ??????????????????");
      return true;
    }
    return false;
  };

  const onClickBack = () => setMode(constants.NORMAL);
  const onClickAll = () => {
    console.log(filterdUrls);
    // ?????? ???????????? ?????? ?????? ??????
    filterdUrls.length !== 0 && handleAddDeleteUrlList(filterdUrls);
    // ????????? ????????? ????????? ?????? ????????? ???
    filterdUrls.length === 0 && handleAddDeleteUrlList(totalUrls);
  };
  const onUnClickAll = () => handleResetDeleteUrl();

  const onClickDelete = () => {
    const _checkError = checkError();
    if (_checkError) return;
    console.log(" ???there's no error");

    const fn = () => {
      // ????????? ??????
      const getData = async () => await handleOnClickDeleteUrl();

      const myPromise = getData();
      toast.promise(myPromise, {
        loading: "??????????????????",
        success: "????????? ?????????????????????!",
        error: "????????? ??????????????? ??????????????? ???????????????",
      });
    };
    handleAlertTrigger(fn, "?????????????????????????");
  };

  return (
    <DeleteWrapper>
      <Item name="????????????" onClick={onClickBack}>
        <CgBackspace />
      </Item>
      <Item name="????????????" onClick={onClickDelete}>
        <HiOutlineDocumentRemove />
      </Item>
      <TagWrapper>
        <Item name="????????????" onClick={onClickAll}>
          <MdRadioButtonChecked />
        </Item>
      </TagWrapper>

      <TagWrapper>
        <Item name="????????????" onClick={onUnClickAll}>
          <MdRadioButtonUnchecked />
        </Item>
      </TagWrapper>
    </DeleteWrapper>
  );
};

const EditModeItems = () => {
  const setMode = useMode().setMode;

  const onClickBack = () => setMode(constants.NORMAL);

  return (
    <EditWrapper>
      <Item name="????????????" onClick={onClickBack}>
        <CgBackspace />
      </Item>
    </EditWrapper>
  );
};

// ?????? ??? ?????? ???
const FolderModeItems = () => {
  const setMode = useMode().setMode;
  const setModalMode = useMode().setModalMode;

  const onClickBack = () => setMode(constants.NORMAL);
  const onClickAddFolder = () => setModalMode(constants.FOLDER_ADD);
  const onClickDeleteFolder = () => setMode(constants.FOLDER_DELETE);
  const onClickEdit = () => setMode(constants.FOLDER_EDIT);

  return (
    <TapsWrapper>
      <Item name="????????????" onClick={onClickBack}>
        <CgBackspace />
      </Item>
      <Item name="????????????" onClick={onClickAddFolder}>
        <HiOutlineFolderAdd />
      </Item>
      <Item name="????????????" onClick={onClickDeleteFolder}>
        <HiOutlineFolderRemove />
      </Item>
      <Item name="????????????" onClick={onClickEdit}>
        <CgEditBlackPoint />
      </Item>
    </TapsWrapper>
  );
};

// ?????? ?????? ???
const FolderEditModeItems = () => {
  const setMode = useMode().setMode;

  const onClickBack = () => setMode(constants.FOLDER);

  return (
    <EditWrapper>
      <Item name="????????????" onClick={onClickBack}>
        <CgBackspace />
      </Item>
    </EditWrapper>
  );
};

//?????? ?????? ???

const FolderDeleteModeItems = () => {
  const setMode = useMode().setMode;
  const filterdFolders = useFolder().filterdFolders;
  const handleAddDeleteFolderList = useFolder().handleAddDeleteFolderList;
  const handleResetDeleteFolder = useFolder().handleResetDeleteFolder;
  const handleOnClickDeleteBtn = useFolder().handleOnClickDeleteBtn;
  const deleteFolders = useFolder().deleteFolders;

  const folders = useSelector(getFolders);
  const handleAlertTrigger = useModal().handleAlertTrigger;

  const onClickBack = () => setMode(constants.FOLDER);
  const onClickAll = () => {
    // ????????? ?????? ?????? ?????? ??????????????? ????????? ???
    // ?????? ???????????? ?????? ?????? ??????
    filterdFolders.length !== 0 && handleAddDeleteFolderList(filterdFolders);
    // ????????? ????????? ????????? ?????? ????????? ???
    filterdFolders.length === 0 && handleAddDeleteFolderList(folders);
  };
  const onUnClickAll = () => handleResetDeleteFolder();

  const onClickDelete = () => {
    const fn = () => {
      // ????????? ??????
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const deleteData = async () => await handleOnClickDeleteBtn();

      const myPromise = deleteData();
      toast.promise(myPromise, {
        loading: "??????????????????",
        success: "????????? ?????????????????????!",
        error: "????????? ??????????????? ??????????????? ???????????????",
      });
      //  ?????? ?????? ??????
    };
    deleteFolders.length === 0 && toast.error("????????? ????????? ??????????????????");
    if (deleteFolders.length === 0) return;
    handleAlertTrigger(fn, "?????????????????????????");
  };

  return (
    <DeleteWrapper>
      <Item name="????????????" onClick={onClickBack}>
        <CgBackspace />
      </Item>
      <Item name="????????????" onClick={onClickDelete}>
        <HiOutlineDocumentRemove />
      </Item>
      <TagWrapper>
        <Item name="????????????" onClick={onClickAll}>
          <MdRadioButtonChecked />
        </Item>
      </TagWrapper>

      <TagWrapper>
        <Item name="????????????" onClick={onUnClickAll}>
          <MdRadioButtonUnchecked />
        </Item>
      </TagWrapper>
    </DeleteWrapper>
  );
};

// ?????? ?????? ??? ????????? ???

const FolderEditUrlModeItems = () => {
  const dispatch = useDispatch();
  const setMode = useMode().setMode;
  const setModalMode = useMode().setModalMode;

  const handleAddFolderEditUrlList = useFolder().handleAddFolderEditUrlList;
  const handleResetFolderEditUrl = useFolder().handleResetFolderEditUrl;
  const filterdUrls = useUrl().url.filterdUrls;
  const totalUrls = useUrl().url.totalUrls;
  const currentFolder = useFolder().currentFolder;
  const handleAlertTrigger = useModal().handleAlertTrigger;
  const handleOnClickSaveFolderEditUrl =
    useFolder().handleOnClickSaveFolderEditUrl;

  // console.log(currentFolder);

  const onClickBack = () => setMode(constants.FOLDER);
  const onClickEdit = async () => {
    const fn = () => {
      const fetchData = async () => {
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        await handleOnClickSaveFolderEditUrl();
      };

      const myPromise = fetchData();
      toast.promise(myPromise, {
        loading: "??????????????????",
        success: "????????? ?????????????????????!",
        error: "????????? ??????????????? ??????????????? ???????????????",
      });
    };
    handleAlertTrigger(fn, "?????????????????????????");
  };
  const onClickAll = () => {
    // console.log(filterdUrls);
    // ?????? ???????????? ?????? ?????? ??????
    filterdUrls.length !== 0 && handleAddFolderEditUrlList(filterdUrls);
    // ????????? ????????? ????????? ?????? ????????? ???
    filterdUrls.length === 0 && handleAddFolderEditUrlList(totalUrls);
  };
  const onUnClickAll = () => handleResetFolderEditUrl();

  const onClickShare = () => setModalMode(constants.SHARE);
  return (
    <TapsWrapper>
      <Item name="????????????" onClick={onClickBack}>
        <CgBackspace />
      </Item>
      <Item name="????????????" onClick={onClickEdit}>
        <CgEditBlackPoint />
      </Item>
      <TagWrapper>
        <Item name="????????????" onClick={onClickAll}>
          <MdRadioButtonChecked />
        </Item>
      </TagWrapper>
      <TagWrapper>
        <Item name="????????????" onClick={onUnClickAll}>
          <MdRadioButtonUnchecked />
        </Item>
      </TagWrapper>
      <TagWrapper>
        <Item name="????????????" onClick={onClickShare}>
          <RiShareBoxFill />
        </Item>
      </TagWrapper>
    </TapsWrapper>
  );
};
