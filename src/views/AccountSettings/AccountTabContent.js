// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import Compressor from 'compressorjs';
import qs from 'qs';
// ** Third Party Components

import { toast } from 'react-toastify'
import { ErrorToast } from '../../extension/toast'
import { unAuthorized } from '../../redux/authentication';
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux';
// ** Reactstrap Imports
import { Row, Col, Form, Card, Label, Button, CardBody, CardTitle, CardHeader, Alert, FormFeedback, Spinner } from 'reactstrap'
import { handleSuccess } from '../../extension/basicalert';
import axios from 'axios';
import { useHistory } from "react-router-dom";

const AccountTabs = ({ userDetail }) => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [compressedFile, setCompressedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useHistory()
  const [status, setStatus] = useState(true)

  const handleCompressedUpload = (file) => {
    const image = file;
    new Compressor(image, {
      quality: 0.6, // 0.6 can also be used, but its not recommended to go below.,
      resize: 'cover',
      success: (compressedResult) => {
        setCompressedFile(compressedResult)
        const imageUrl = URL.createObjectURL(compressedResult);
        setImageUrl(imageUrl)
      }
    });
  };

  const removeLogo =  async () => {
    try {
      await axios.post(`/admin/remove-logo`).catch(err => { throw err.response.status });
      handleSuccess({ title: 'İşlem Başarılı', timer: 1200, message: 'Güncelleme başarılı bir şekilde yapıldı.' });
    } catch (err) {
      if (err === 404) {
        toast.error(<ErrorToast message={'Kayıt İşlemi Başarısız oldu'} />, { icon: false, hideProgressBar: true })
      } else if (err === 401) {
        dispatch(unAuthorized())
      }
    }

  }

  const checkError = () => {
    if (errors.hasOwnProperty('contact') || errors.hasOwnProperty('name') || errors.hasOwnProperty('email') || errors.hasOwnProperty('companyName')) {
      toast.error(<ErrorToast message={'Lütfen Zorunlu Alanları Doldurunuz'} />, { icon: false, hideProgressBar: true })
    }
  }

  const onSubmit = async (data) => {
    setStatus(false)
    const formData = new FormData();
    if (compressedFile) {
      formData.append('image', compressedFile, compressedFile.name);
    }
    formData.set('business_detail', qs.stringify(data));


    try {
      await axios.post(`/admin/update-business-detail`, formData).catch(err => { throw err.response.status });
      setStatus(true)
      handleSuccess({ title: 'İşlem Başarılı', timer: 1200, message: 'Güncelleme başarılı bir şekilde yapıldı.' });

    } catch (err) {
      if (err === 404) {
        toast.error(<ErrorToast message={'Kayıt İşlemi Başarısız oldu'} />, { icon: false, hideProgressBar: true })

      } else if (err === 401) {
        dispatch(unAuthorized())
      }
    }

  }
  const setImage = (e) => {
    if (e.target) {
      handleCompressedUpload(...e.target.files)
    }
  }

  useEffect(() => {

    if (compressedFile) {

    }
  }, [compressedFile])
  return (
    <Fragment>
      {userDetail ?

        <Card>
          <CardHeader className='border-bottom'>
            <CardTitle tag='h4'>İşletme Ayarları</CardTitle>
          </CardHeader>
          <CardBody className='py-2 my-25'>
            <Form className='mt-2 pt-50' onSubmit={() => {
              checkError();
              handleSubmit(onSubmit)(event).catch((error) => {
              })
            }} >
              <Row>
                <div className='d-flex col '>
                  <div className='me-25'>
                    {imageUrl ?
                      <img className='rounded me-50 shadow' src={imageUrl} alt='İşletmeye ait logo ' height='100' width='100' />
                      : <img className='rounded me-50 shadow img-fluid' src={userDetail.userLogo} alt='İşletmeye ait logo ' height='100' width='200' />
                    }
                    <div className='mt-2'>
                      <Button tag={Label} className='mb-75 me-75' size='sm' color='primary'>
                        Yükle
                        <input className='form-control' type='file' hidden accept='image/*' onChange={setImage} />
                      </Button>
                      <Button tag={Label} className='mb-75 me-75' size='sm' color='danger' onClick={() => removeLogo()}>
                        Sil
                      </Button>
                      <p className='mb-0'> JPG veya PNG türünde yükleme yapınız. <br />Logo boyutu 180x30 olarak ayarlanmıştır</p>
                    </div>
                  </div>
                </div>
                {/* 
              
               <div className='col d-flex justify-content-end'>
                  <div>
                    <img className='shadow-sm' alt="ImageName" src={userDetail.qrcode} style={{ height: 100, width: 100 }} />

                    <a href={userDetail.qrcode} className='btn btn-primary ms-4 ' download> İndir</a>
                  </div>
                </div>
              */}
              </Row>

              <Row className='mt-2'>
                <Col sm='6' className='mb-1'>
                  <Label className='form-label' > Ad Soyadı  </Label>
                  <input className='form-control' defaultValue={userDetail.name} {...register("name", { required: true })} />
                </Col>
                <Col sm='6' className='mb-1'>
                  <Label className='form-label' > Kullanıcı adı  </Label>
                  <input className='form-control' disabled defaultValue={userDetail.username} />
                </Col>
                <Col sm='6' className='mb-1'>
                  <Label className='form-label' > E-mail </Label>
                  <input className='form-control' type='email' defaultValue={userDetail.contact.email} {...register("contact.email", { required: true })} />

                </Col>
                <Col sm='6' className='mb-1'>
                  <Label className='form-label' >  İşletme Adı  </Label>
                  <input className='form-control' defaultValue={userDetail.companyName} {...register("companyName", { required: true })} />

                </Col>
                <Col sm='6' className='mb-1'>
                  <Label className='form-label' > Telefon Numarası </Label>
                  <input className='form-control' type='number' defaultValue={userDetail.contact.phone} {...register("contact.phone", { required: true })} />

                </Col>
                <Col sm='6' className='mb-1'>
                  <Label className='form-label' > Adres</Label>
                  <input className='form-control' defaultValue={userDetail.contact.address} {...register("contact.address", { required: true })} />

                </Col>

                <Col className='mt-2' sm='12'>
                  {status ?

                    <Button type='submit' className='me-1' color='primary'>
                      Kaydet
                    </Button>
                    :
                    <Button color='primary'>
                      <Spinner color='white' size='sm' />
                      <span className='ms-50'>Yükleniyor...</span>
                    </Button>
                  }
                </Col>
                <Col className='mt-5'>
                  {errors.hasOwnProperty('name', 'companyName') &&
                    <Alert color="danger p-1"> Lütfen Bütün Alanları Doldurunuz !</Alert>}
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
        :
        <div></div>
      }

    </Fragment >
  )
}

export default AccountTabs