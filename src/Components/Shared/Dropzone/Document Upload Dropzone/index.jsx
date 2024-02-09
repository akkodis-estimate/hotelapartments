import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import DefaultImg from "Assets/Images/dropzoneDefaultImg.png";
import DefaultDocImg from "Assets/Images/documentUpload.png";
import "Components/Shared/Dropzone/Document Upload Dropzone/fileupload.css"
import { toast } from "react-toastify";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import DeleteIcon from "Assets/Images/SettingIcons/delete-icon";
import FileIcon from "Assets/Images/SettingIcons/file-icon";
import DownloadIcon from "Assets/Images/SettingIcons/download-icon";


const DocumentUpload = ({
  isShowSelectButton = true,
  isDragOff = false,
  disabled = false,
  isMultiple = false,
  isPreview = false,
  isDocument = false,
  maxFilesCount = 0,
  maxFileSize = 100,
  minFileSize = 0,
  acceptType = { "image/*": [] },
  files,
  setFiles,
  filesPreview,
  setFilesPreview,
  handleRemove,
  handleUpload,
}) => {
  const { t } = useTranslation();
 
  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noDrag : isDragOff,
    noClick: isShowSelectButton,
    noKeyboard: true,
    maxFiles: maxFilesCount,
    multiple: isMultiple,
    maxSize: (maxFileSize * 1024 * 1024),
    minSize: minFileSize,
    accept: acceptType,

    onDrop: acceptedFiles => {
      afterFileUpload(acceptedFiles);
    },
    onError: err => {
      toast.error(err.message);
    },
    validator: myValidators
  });

  function myValidators(file) {
    if (file.size / (1024 * 1024) > maxFileSize) {
      toast.error(file.name + " is too large.");
      return {
        code: "file size too large",
        message: `Please upload file less then ${maxFileSize} mb.`
      };
    }
    return null
  }


  const afterFileUpload = (acceptedFiles) => {
    let isMaxFileReached = false;
    let arr = isPreview ? [...filesPreview] : []
    let newFiles = [...files];
    acceptedFiles.forEach((element, index) => {
      let obj = {
        ...element,
        previewUrl: URL.createObjectURL(element),
        id: index
      }
      if (arr.length < maxFilesCount) {
        arr.push(obj);
        newFiles.push(element);
      } else {
        isMaxFileReached = true;
      }
    });
    if (isMaxFileReached) {
      toast.error(`You can add only ${maxFilesCount} files.`)
    }
    if (isPreview) {
      setFilesPreview(arr)
    }
    setFiles(newFiles);
  }

  const removeFile = (fileIndex) => {
    let arr = [];
    let removed = files.splice(fileIndex, 1);
    handleRemove(removed);
    files.forEach((element, index) => {
      if (element.hasUrl) {
        arr.push(element);
      } else {
        let obj = {
          ...element,
          previewUrl: URL.createObjectURL(element),
          id: index
        }
        arr.push(obj);
      }
    });
    if (isPreview) {
      setFilesPreview(arr);
    }
  }

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    if (filesPreview) {
      return () => filesPreview.forEach(file => URL.revokeObjectURL(file.previewUrl));
    }
  }, [filesPreview]);

  return (
    <>
       {!isDocument ? (<div className='row dropzoneLbl justify-content-between align-items-center'>
        <div className='col'>
          <label>{t("upload.up_to_20_photos")}</label>
        </div>
        <div className='col d-flex justify-content-end'>
          <span>{files?.length && files?.length >= 0 ? files?.length : 0}/{maxFilesCount}</span>
        </div>
      </div>) : null}
      <div className='row m-0 mt-3'>

        <div className="col-lg-12 dropzoneFileUpload">
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='d-flex flex-column align-items-center justify-content-center'>
              <div className='d-flex flex-column align-items-center justify-content-center mb-3 dropzoneContent'>
                <img src={isDocument ? DefaultDocImg : DefaultImg} alt="defaultImg" />
                <p className='text-center mt-3 mb-1'>
                  {isDocument ? t("upload.drop_select") : t("upload.drop_img")}<br />
                  <span style={{ color: '#2849C7' }}>{t("upload.click_to_browse")}</span>
                </p>
                <span className='dropMsg'>{t("upload.max_100")}</span>
                {isDocument ? <span className='dropMsg'>{t("upload.only_doc_docx_pdf")}</span> : null}
              </div>

              {isShowSelectButton ? <button type="button" disabled={disabled} onClick={() => {open()}}>
                {t("upload.select_file")}
              </button> : null}
            </div>
          </div>
        </div>
      </div>
      <div className='dropzoneImgPreviews mt-4'>
        <div className='row'>
          {isPreview ? (filesPreview.map((file, index) => {
            return (!isDocument ? (<div className='col-lg-2 mb-4' key={index}>
              <div className='position-relative'>
                <img src={file.previewUrl} alt="" className='previewImg' onLoad={() => { URL.revokeObjectURL(file.previewUrl) }} />

                <div className='imgOverlay'>
                  <div className='d-flex justify-content-end p-2'>
                    <button type="button" className='previewCancelBtn' onClick={() => { removeFile(index); }}><FiX /></button>
                  </div>
                </div>
              </div>
            </div>) : (<div className="mt-2" key={index}>
              <div className="col-lg-12 mb-2">
                <div className="contractsPreviewDes d-flex align-items-center justify-content-between">
                  <div className="contractNameIcon d-flex col-lg-7 align-items-center">
                    <div className="fileIcon">
                      <FileIcon />
                    </div>
                    <div className="contractContent ms-3">
                      <h3>{file.path}</h3>
                    </div>
                  </div>
                  <span className="contractsExtension">{file.path?.substring(file.path?.lastIndexOf(".")+1).toUpperCase()}</span>
                  <div className="contractsActions d-flex align-items-center">
                    {/* <span className="me-3"> <EyeIcon/> </span> */}
                    <span className="me-3"> {file.hasUrl === true ? (<a href={file.previewUrl} target='_blank' download onLoad={() => { URL.revokeObjectURL(file.previewUrl) }} rel="noreferrer"><DownloadIcon /></a>) : null } </span>
                    <span onClick={() => { if(!disabled) {removeFile(index); }}}><DeleteIcon /></span>
                  </div>
                </div>
              </div>
            </div>))
          })) : null}
        </div>
      </div>
    </>
  );
};

export default DocumentUpload;
