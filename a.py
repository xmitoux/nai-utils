import sys
import os
import shutil
from PIL import Image
import numpy as np
import gzip
import json
import yaml

class LSBExtractor:
    def __init__(self, data):
        self.data = data
        self.rows, self.cols, self.dim = data.shape
        self.bits = 0
        self.byte = 0
        self.row = 0
        self.col = 0

    def _extract_next_bit(self):
        if self.row < self.rows and self.col < self.cols:
            bit = self.data[self.row, self.col, self.dim - 1] & 1
            self.bits += 1
            self.byte <<= 1
            self.byte |= bit
            self.row += 1
            if self.row == self.rows:
                self.row = 0
                self.col += 1

    def get_one_byte(self):
        while self.bits < 8:
            self._extract_next_bit()
        byte = bytearray([self.byte])
        self.bits = 0
        self.byte = 0
        return byte

    def get_next_n_bytes(self, n):
        bytes_list = bytearray()
        for _ in range(n):
            byte = self.get_one_byte()
            if not byte:
                break
            bytes_list.extend(byte)
        return bytes_list

    def read_32bit_integer(self):
        bytes_list = self.get_next_n_bytes(4)
        if len(bytes_list) == 4:
            integer_value = int.from_bytes(bytes_list, byteorder='big')
            return integer_value
        else:
            return None

def process_images(input_folder, output_folder, metadeta_txt):
    cnt = 0
    data_cnt = 0

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for fn in os.listdir(input_folder):
        cnt = cnt + 1
        if fn.lower().endswith('.png'):
            file_path = os.path.join(input_folder, fn)
            try:
                img = Image.open(file_path)
                img = np.array(img)
                if img.shape[-1] != 4 or len(img.shape) != 3:
                    raise ValueError("image format")

                reader = LSBExtractor(img)
                magic = "stealth_pngcomp"
                read_magic = reader.get_next_n_bytes(len(magic)).decode("utf-8")
                if magic != read_magic:
                    raise ValueError("magic number")

                read_len = reader.read_32bit_integer() // 8
                json_data = reader.get_next_n_bytes(read_len)
                json_data = json.loads(gzip.decompress(json_data).decode("utf-8"))
                if "Comment" in json_data:
                    json_data["Comment"] = json.loads(json_data["Comment"])
                    data_cnt = data_cnt + 1
                yaml_data = yaml.dump(json_data, default_flow_style=False, sort_keys=False, width=float("inf"))

                # Copy file to new folder
                shutil.copy(file_path, os.path.join(output_folder, fn))

                # Print result
                with open(metadeta_txt, 'a') as file:
                    file.write(f"{fn}:\n{yaml_data}\n")
                    file.write("------------\n")
                print(f"{fn}:\n{yaml_data}\n")
            except Exception as e:
                print(f"{fn} failed: {str(e)}")
    print(f"count:{data_cnt} / {cnt} pic")

if __name__ == "__main__":
    input_folder = "E:\\ピクチャ\\クロール\\みんなのイラスト新着作品 - pixiv"
    output_folder = "E:\\ピクチャ\\クロール\\みんなのイラスト新着作品 - pixiv\\info"
    metadeta_txt = 'E:\\ピクチャ\\クロール\\みんなのイラスト新着作品 - pixiv\\info\\metadeta.txt'
    process_images(input_folder, output_folder,metadeta_txt)
