import { Snackbar, Alert } from '@mui/material';

const Toast = ({ message, type, hideDuration = 2000, handleAlertClose }) => {
  return (
    <Snackbar open={!!message} autoHideDuration={hideDuration} onClose={handleAlertClose}>
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  )
}

export default Toast