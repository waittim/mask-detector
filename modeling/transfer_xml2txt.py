import os
import sys
import xml.etree.ElementTree as ET
import glob
 
def xml_to_txt(indir,outdir):
 
    os.chdir(indir)
    annotations = os.listdir('.')
    annotations = glob.glob(str(annotations)+'*.xml')
    #print(annotations)
    for i, file in enumerate(annotations):
 
        file_save = file.split('.')[0]+'.txt'
        print(file_save)
        # file_txt=os.path.join(outdir,file_save)
        file_txt = outdir+"/"+file_save
        # print(file_save)
        f_w = open(file_txt, 'w')
 
        # actual parsing
        in_file = open(file)
        tree=ET.parse(in_file)
        root = tree.getroot()
        filename = root.find('filename').text  #这里是xml的根，获取filename那一栏
        for obj in root.iter('object'):
                current = list()
                name = obj.find('name').text   #这里获取多个框的名字，底下是获取每个框的位置
 
                xmlbox = obj.find('bndbox')
                xn = xmlbox.find('xmin').text   
                xx = xmlbox.find('xmax').text
                yn = xmlbox.find('ymin').text
                yx = xmlbox.find('ymax').text
                #print xn
                f_w.write(filename +' '+xn+' '+yn+' '+xx+' '+yx+' ')
                f_w.write(name+'\n')
 
indir='./modeling/dataset/xml_labels'   #xml目录
outdir='./modeling/dataset/labels'  #txt目录
 
xml_to_txt(indir,outdir)