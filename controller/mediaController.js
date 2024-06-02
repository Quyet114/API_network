const uploadMediaToCloudinary = {
    uploadMedia: async (req, res, next) => {
        try {
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }

            const mediaDataArray = files.map(file => ({
                url: file.path,
                filename: file.filename
            }));

            console.log(mediaDataArray);
            res.status(200).json(mediaDataArray);
        } catch (error) {
            console.error(error);
            if (error.message === 'Invalid file type. Only jpg, png, and mp4 files are allowed.') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },
};

module.exports = uploadMediaToCloudinary;
