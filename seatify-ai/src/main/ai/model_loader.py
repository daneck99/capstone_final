import torch
from models.common import DetectMultiBackend
from utils.general import check_img_size
from utils.torch_utils import select_device

model = None
device = None
imgsz = (640, 640)

def load_model_instance(weights_path, data_path, imgsz=(640, 640), device_str=''):
    device = select_device(device_str)
    model = DetectMultiBackend(weights_path, device=device, data=data_path)
    model.eval()
    imgsz_checked = check_img_size(imgsz, s=model.stride)
    model.warmup(imgsz=(1, 3, *imgsz_checked))
    return model, device
