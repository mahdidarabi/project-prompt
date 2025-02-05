import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import { useMergeRequestStore } from '../../store/mergeRequestStore'
import { useFileStore } from '../../store/fileStore'

interface AttachMergeRequestModalProps {
  open: boolean
  onClose: () => void
}

const StyledDialogTitle = styled(DialogTitle)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

export default function AttachMergeRequestModal({
  open,
  onClose,
}: AttachMergeRequestModalProps) {
  const {
    apiUrl,
    mergeRequestLink,
    apiToken,
    setApiUrl,
    setMergeRequestLink,
    setApiToken,
  } = useMergeRequestStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addAttachmentFile = useFileStore(state => state.addAttachmentFile)

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = async () => {
    if (!apiUrl || !mergeRequestLink || !apiToken) return
    setIsSubmitting(true)
    try {
      const url = new URL(apiUrl)
      url.searchParams.set('mergeRequestLink', mergeRequestLink)
      url.searchParams.set('apiToken', apiToken)

      const response = await fetch(url.toString())
      const data = await response.json()
      if (data && data.context) {
        addAttachmentFile(data.context)
      }
    } catch (err) {
      console.error('Failed to fetch merge request context:', err)
    } finally {
      setIsSubmitting(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        Attach Merge Request Context
        <Tooltip title="Close">
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </StyledDialogTitle>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="But-wait server apiURL"
          value={apiUrl}
          onChange={e => setApiUrl(e.target.value)}
          fullWidth
        />

        <TextField
          label="Merge Request Link"
          value={mergeRequestLink}
          onChange={e => setMergeRequestLink(e.target.value)}
          fullWidth
        />

        <TextField
          label="GitLab Api Token"
          value={apiToken}
          onChange={e => setApiToken(e.target.value)}
          fullWidth
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || !apiUrl || !mergeRequestLink || !apiToken}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
