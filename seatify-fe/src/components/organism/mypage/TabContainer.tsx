import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

type TabContainerProps = {
  accessToken: string;
  storeId: string;
};

const TabContainer = ({ accessToken, storeId }: TabContainerProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [isUploaded, setIsUploaded] = useState(false); // ✅ 추가

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadMarker = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(
      `http://localhost:5001/upload-image?store_id=${storeId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error('업로드 실패');
    }

    const result = await res.json();
    console.log('✅ 업로드 성공 결과:', result);
    return result;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadMarker(selectedFile, accessToken);
      setUploadSuccess(true);
      setIsUploaded(true); // ✅ 업로드 성공 시 완료 상태로 변경
    } catch (error) {
      console.error(error);
      setUploadSuccess(false);
    } finally {
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploaded(false); // ✅ 다시 업로드 초기화
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        아르코 마커 이미지 업로드
      </Typography>

      {!isUploaded ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {previewUrl && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <img
                src={previewUrl}
                alt="미리보기"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              component="label"
              sx={{ minWidth: 120, bgcolor: '#7B4A20' }}
            >
              파일 선택
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              sx={{ minWidth: 120 }}
              disabled={!selectedFile}
            >
              업로드
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            이미지 업로드가 완료되었습니다.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" onClick={handleReset}>
              다시 업로드 하기
            </Button>
          </Box>
        </Paper>
      )}

      {/* ✅ Dialog 모달 유지 */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.3)' } }}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '400px',
            padding: '20px',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h2" component="div">
            {uploadSuccess ? '업로드 성공' : '업로드 실패'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ my: 2 }}>
            {uploadSuccess
              ? '이미지가 정상적으로 업로드 되었습니다.'
              : '이미지 업로드 중 오류가 발생했습니다.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TabContainer;
